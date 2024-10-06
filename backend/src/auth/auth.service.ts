import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt'; 
import { JwtPayload } from './jwt-payload.interface';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService, // تزریق JwtService
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

    // مقایسه پسورد ارسال شده با پسورد هش شده در دیتابیس
    console.log('Phone number entered:', loginDto.phone);
    console.log('User found:', user);
    console.log('Password entered:', loginDto.password);
    console.log('Password in database:', user.password);
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    console.log('Password comparison result:', isPasswordValid);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // ایجاد payload شامل userId، phone و username
    const payload: JwtPayload = { 
      userId: user._id.toString(),
      phone: user.phone,
      username: user.username,
    };

    // تولید JWT با استفاده از payload و افزودن زمان انقضا
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    // بازگرداندن JWT به همراه اطلاعات کاربر
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
  async register(registerDto: RegisterDto): Promise<any> {
    const existingUser = await this.usersService.findByPhone(registerDto.phone);
    if (existingUser) {
      throw new ConflictException('Phone number already registered');
    }

    // هش کردن پسورد ورودی
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // ساخت کاربر جدید
    const createdUser = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    // ایجاد payload برای JWT
    const payload: JwtPayload = {
      userId: createdUser._id.toString(),
      phone: createdUser.phone,
      username: createdUser.username,
    };

    // تولید JWT با زمان انقضا
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    return {
      message: 'User registered successfully',
      accessToken,
      user: {
        id: createdUser._id.toString(),
        phone: createdUser.phone,
        username: createdUser.username,
      },
    };
  }
}
