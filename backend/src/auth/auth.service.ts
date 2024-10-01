import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common'; 
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt'; 
import { JwtPayload } from './jwt-payload.interface';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // متد validateUser برای اعتبارسنجی JWT
  async validateUser(payload: JwtPayload): Promise<any> {
    const user = await this.usersService.findOne(payload.userId.toString()); // تبدیل userId به string
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
  

  // متد login برای لاگین کاربر
  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.usersService.findByEmail(loginDto.email);
  
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // مقایسه پسورد ارسال شده با پسورد هش شده در دیتابیس
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // ایجاد payload شامل userId، email و username
    const payload: JwtPayload = { 
      userId: user._id.toString(),  // تبدیل _id به رشته
      email: user.email, 
      username: user.username,
    };
    
    // تولید JWT با استفاده از payload
    const accessToken = this.jwtService.sign(payload);

    // بازگرداندن JWT به همراه اطلاعات کاربر
    return {
      accessToken,
      user: {
        id: user._id.toString(), // تبدیل _id به رشته
        email: user.email,
        username: user.username,
      },
    };
  }

  // متد ثبت نام کاربر
  async register(registerDto: RegisterDto): Promise<any> {
    // بررسی اینکه آیا ایمیل قبلاً ثبت شده یا خیر
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // هش کردن پسورد ورودی
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    // ساخت کاربر جدید با اطلاعات ورودی و پسورد هش شده
    const createdUser = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      _id: new Types.ObjectId(), // اضافه کردن _id به صورت خودکار
    });

    // ایجاد payload برای JWT
    const payload: JwtPayload = {
      userId: createdUser._id.toString(), // تبدیل _id به رشته
      email: createdUser.email,
      username: createdUser.username,
    };

    // تولید JWT
    const accessToken = this.jwtService.sign(payload);

    // بازگرداندن JWT به همراه اطلاعات کاربر
    return {
      accessToken,
      user: {
        id: createdUser._id.toString(), // تبدیل _id به رشته
        email: createdUser.email,
        username: createdUser.username,
      },
    };
  }
}
