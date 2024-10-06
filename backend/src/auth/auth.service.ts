import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt'; 
import { JwtPayload } from './jwt-payload.interface';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private verificationCodes = new Map<string, { code: string; expiresAt: number }>();

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // متد validateUser برای اعتبارسنجی JWT
  async validateUser(payload: JwtPayload): Promise<any> {
    const user = await this.usersService.findOne(payload.userId.toString());
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  // متد login برای لاگین کاربر
  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.usersService.findByPhone(loginDto.phone);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { 
      userId: user._id.toString(),
      phone: user.phone,
      username: user.username,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    return {
      message: 'User logged in successfully',
      accessToken,
      user: {
        id: user._id.toString(),
        phone: user.phone,
        username: user.username,
      },
    };
  }

  // متد ثبت نام کاربر
// ثبت‌نام کاربر
async register(registerDto: { phone: string; username: string; password: string }) {
  const existingUser = await this.usersService.findByPhone(registerDto.phone);
  if (existingUser) {
    throw new ConflictException('Phone number already registered');
  }

  const hashedPassword = await bcrypt.hash(registerDto.password, 10);
  const newUser = await this.usersService.create({
    phone: registerDto.phone,
    username: registerDto.username,
    password: hashedPassword,
  });

  const payload: JwtPayload = {
    userId: newUser._id.toString(),
    phone: newUser.phone,
    username: newUser.username,
  };

  const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

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

  // ذخیره کد تایید به همراه زمان انقضا
  async saveVerificationCode(phone: string, code: string): Promise<void> {
    const expiresAt = Date.now() + 10 * 60 * 1000; // اعتبار کد تایید: 10 دقیقه
    this.verificationCodes.set(phone, { code: await bcrypt.hash(code, 10), expiresAt });
  }

  // متد verifyCode برای بررسی کد با اعتبار
  async verifyCode(phone: string, code: string): Promise<boolean> {
    const verificationData = this.verificationCodes.get(phone);
    if (!verificationData) {
      throw new NotFoundException('Verification code not found');
    }
    
    const { code: hashedCode, expiresAt } = verificationData;

    if (Date.now() > expiresAt) {
      this.verificationCodes.delete(phone); // حذف کد منقضی شده
      throw new UnauthorizedException('Verification code expired');
    }

    const isValid = await bcrypt.compare(code, hashedCode);
    if (!isValid) {
      throw new UnauthorizedException('Invalid verification code');
    }

    this.verificationCodes.delete(phone); // حذف کد تایید پس از استفاده
    return true;
  }

  // متد findByPhone برای جستجوی کاربر بر اساس شماره تلفن
  async findByPhone(phone: string) {
    return this.usersService.findByPhone(phone);
  }

  // متد generateToken برای تولید JWT
  async generateToken(user: any): Promise<string> {
    const payload: JwtPayload = {
      userId: user._id.toString(),
      phone: user.phone,
      username: user.username,
    };

    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }
}
