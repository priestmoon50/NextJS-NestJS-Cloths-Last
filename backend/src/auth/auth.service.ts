import { Injectable, ConflictException, UnauthorizedException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt'; 
import { JwtPayload } from './jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private verificationCodes = new Map<string, { code: string; expiresAt: number }>();
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // متد کمکی برای تولید JWT با استفاده از متغیرهای محیطی برای زمان انقضا
  public generateJwtToken(user: any): string {
    const payload: JwtPayload = {
      userId: user._id.toString(),
      phone: user.phone,
      username: user.username,
    };
    return this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRATION_TIME || '1h', // زمان انقضای JWT از .env
      secret: process.env.JWT_SECRET || 'secretKey', // کلید JWT از .env
    });
  }

  // متد لاگین
  async login(phone: string, password: string): Promise<any> {
    const user = await this.usersService.findByPhone(phone);
    if (!user) {
      this.logger.warn(`User with phone ${phone} not found`);
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password for user ${user.username}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateJwtToken(user);

    return {
      message: 'Login successful',
      accessToken,
      user: {
        id: user._id.toString(),
        phone: user.phone,
        username: user.username,
      },
    };
  }

  // متد ثبت نام
  async register(registerDto: { phone: string; username: string; password: string }) {
    const existingUser = await this.usersService.findByPhone(registerDto.phone);
    if (existingUser) {
      this.logger.warn(`Phone number ${registerDto.phone} is already registered`);
      throw new ConflictException('Phone number already registered');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const newUser = await this.usersService.create({
      phone: registerDto.phone,
      username: registerDto.username,
      password: hashedPassword,
    });

    const accessToken = this.generateJwtToken(newUser);

    return {
      message: 'Registration successful',
      accessToken,
      user: {
        id: newUser._id.toString(),
        phone: newUser.phone,
        username: newUser.username,
      },
    };
  }

  // ذخیره کد تایید با زمان انقضا و هش کردن کد
  async saveVerificationCode(phone: string, code: string): Promise<void> {
    const expiresAt = Date.now() + (parseInt(process.env.CODE_EXPIRATION_TIME) || 10 * 60 * 1000); // اعتبار کد تایید: 10 دقیقه یا از .env
    const hashedCode = await bcrypt.hash(code, 10); 
    this.verificationCodes.set(phone, { code: hashedCode, expiresAt });
    this.logger.log(`Verification code for ${phone} saved successfully.`);
  }

  // متد تایید کد
  async verifyCode(phone: string, code: string): Promise<boolean> {
    const verificationData = this.verificationCodes.get(phone);
    if (!verificationData) {
      this.logger.warn(`Verification code for ${phone} not found`);
      throw new NotFoundException('Verification code not found');
    }

    const { code: hashedCode, expiresAt } = verificationData;

    if (Date.now() > expiresAt) {
      this.verificationCodes.delete(phone); // حذف کد منقضی شده
      this.logger.warn(`Verification code for ${phone} expired`);
      throw new UnauthorizedException('Verification code expired');
    }

    const isValid = await bcrypt.compare(code, hashedCode);
    if (!isValid) {
      this.logger.warn(`Invalid verification code for ${phone}`);
      throw new UnauthorizedException('Invalid verification code');
    }

    this.verificationCodes.delete(phone); // حذف کد تایید پس از استفاده
    this.logger.log(`Verification code for ${phone} validated successfully.`);
    return true;
  }

  // متد جستجوی کاربر بر اساس شماره تلفن
  async findByPhone(phone: string) {
    return this.usersService.findByPhone(phone);
  }
}
