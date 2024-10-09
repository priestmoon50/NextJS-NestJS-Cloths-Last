import { Injectable, UnauthorizedException, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private verificationCodes = new Map<string, { code: string; expiresAt: number }>();
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // تولید توکن JWT
  public generateJwtToken(user: any): string {
    const payload: JwtPayload = {
      userId: user._id.toString(),
      phone: user.phone,
    };
    return this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRATION_TIME || '1h',
      secret: process.env.JWT_SECRET || 'secretKey',
    });
  }

  // تولید و ذخیره کد تایید
  async generateVerificationCode(phone: string): Promise<string> {
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    await this.saveVerificationCode(phone, verificationCode);
    return verificationCode;
  }

  // ذخیره کد تایید به همراه زمان انقضا
  async saveVerificationCode(phone: string, code: string): Promise<void> {
    const expiresAt = Date.now() + (parseInt(process.env.CODE_EXPIRATION_TIME) || 10 * 60 * 1000); 
    const hashedCode = await bcrypt.hash(code, 10);
    this.verificationCodes.set(phone, { code: hashedCode, expiresAt });
    this.logger.log(`Verification code for ${phone} saved successfully.`);
  }

  // تایید کد وارد شده توسط کاربر
  async verifyCode(phone: string, code: string): Promise<boolean> {
    this.logger.log(`Verifying code for phone: ${phone}`);
    const verificationData = this.verificationCodes.get(phone);
    
    if (!verificationData) {
      this.logger.warn(`Verification code for ${phone} not found`);
      throw new NotFoundException('Verification code not found');
    }

    const { code: hashedCode, expiresAt } = verificationData;

    if (Date.now() > expiresAt) {
      this.verificationCodes.delete(phone);
      this.logger.warn(`Verification code for ${phone} expired`);
      throw new UnauthorizedException('Verification code expired');
    }

    const isValid = await bcrypt.compare(code, hashedCode);
    if (!isValid) {
      this.logger.warn(`Invalid verification code for ${phone}`);
      throw new UnauthorizedException('Invalid verification code');
    }

    this.logger.log(`Verification code for ${phone} validated successfully.`);
    return true;
  }

  // تایید کد و بررسی وجود کاربر یا ایجاد کاربر جدید
  async confirmCode(phone: string, code: string): Promise<any> {
    const isValid = await this.verifyCode(phone, code);
    if (!isValid) {
      throw new UnauthorizedException('Invalid verification code');
    }
  
    // تلاش برای یافتن کاربر
    let user = await this.usersService.findByPhone(phone);
  
    // اگر کاربر یافت نشد، ایجاد کاربر جدید
    if (!user) {
      this.logger.log(`No user found for phone number ${phone}. Creating new user.`);
      user = await this.register({ phone });
    }
  
    // به‌روزرسانی وضعیت تایید کاربر
    user = await this.usersService.updateUserVerificationStatus(phone, true);
  
    // تولید توکن JWT برای کاربر
    const token = this.generateJwtToken(user);
  
    return {
      message: 'Login successful',
      accessToken: token,
      user,
    };
  }
  

  
  // ثبت‌نام کاربر با استفاده از شماره تلفن
  async register({ phone }: { phone: string }) {
    // چک کردن اینکه شماره از قبل موجود نباشد
    const existingUser = await this.usersService.findByPhone(phone);
    if (existingUser) {
      throw new ConflictException('Phone number already registered');
    }

    // ایجاد کاربر جدید
    const newUser = await this.usersService.create({ phone });
    this.logger.log(`User with phone ${phone} created successfully.`);
    return newUser;
  }
}
