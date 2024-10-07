// backend/src/auth/auth.controller.ts

import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SmsService } from './sms.service';
import { PhoneVerificationDto } from './dto/phone-verification.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, 
    private readonly smsService: SmsService  // اضافه کردن smsService برای ارسال پیامک
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    return {
      message: 'Login successful',
      accessToken: token,
    };
  }

// backend/src/auth/auth.controller.ts

@Post('register')
@HttpCode(HttpStatus.CREATED)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
async register(@Body() registerDto: RegisterDto) {
  const userExists = await this.authService.findByPhone(registerDto.phone);
  
  if (userExists) {
    return { message: 'Phone number already registered.', success: false };
  }

  const newUser = await this.authService.register(registerDto);  // ثبت‌نام کاربر
  const token = await this.authService.generateToken(newUser);  // تولید JWT برای کاربر جدید
  return {
    message: 'Registration successful',
    accessToken: token,
    user: newUser,
  };
}



  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return { message: 'Logout successful' };
  }


  
  // مسیر جدید برای ارسال کد به شماره تلفن
  @Post('verify-phone')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async verifyPhone(@Body() phoneVerificationDto: PhoneVerificationDto) {
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString(); // تولید کد ۴ رقمی
    await this.smsService.sendVerificationCode(phoneVerificationDto.phone, verificationCode); // ارسال کد به شماره تلفن
    await this.authService.saveVerificationCode(phoneVerificationDto.phone, verificationCode);  // ذخیره کد تایید در سرویس
    return { message: 'Verification code sent' };
  }

  // مسیر جدید برای تأیید کد و بررسی ثبت‌نام


@Post('confirm-code')
@HttpCode(HttpStatus.OK)
async confirmCode(@Body() { phone, code }: { phone: string; code: string }) {
  const isValid = await this.authService.verifyCode(phone, code);  // بررسی صحت کد
  if (!isValid) {
    return { message: 'Invalid verification code', success: false };
  }

  const user = await this.authService.findByPhone(phone);
  if (user) {
    const token = await this.authService.generateToken(user);  // تولید JWT
    return {
      message: 'Login successful',
      accessToken: token,
      user,
    };
  } else {
    return { message: 'Phone number not registered. Proceed to registration.', success: true };
  }
}

}

