import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SmsService } from './sms.service';
import { UsersService } from '../users/users.service'; // اضافه کردن UsersService

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly smsService: SmsService,
    private readonly usersService: UsersService,  // استفاده از UsersService
  ) {}

  // ارسال کد تایید به شماره تلفن (در هر صورت، چه کاربر وجود داشته باشد یا نه)
  @Post('verify-phone')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async verifyPhone(@Body() { phone }: { phone: string }) {
    // Generate OTP
    const otp = await this.authService.generateVerificationCode(phone);
    
    // Check if user exists
    let user = await this.usersService.findByPhone(phone);

    if (!user) {
      // If user doesn't exist, create a temporary user with OTP and expiry
      const otpExpiryTime = Date.now() + 10 * 60 * 1000; // 10-minute expiry
      await this.usersService.createTemporaryUser(phone, otp, otpExpiryTime);
    } else {
      // If user exists, update OTP and expiry in their record
      const otpExpiryTime = Date.now() + 10 * 60 * 1000;
      await this.usersService.updateUserOtp(phone, otp, otpExpiryTime);
    }

    // Send OTP to user
    await this.smsService.sendVerificationCode(phone, otp);
    return { message: 'Verification code sent' };
  }

  // تایید کد ارسال شده و ورود کاربر (برای هر دو حالت کاربر موقت و کاربر ثبت‌شده)
  @Post('confirm-code')
  @HttpCode(HttpStatus.OK)
  async confirmCode(@Body() { phone, code }: { phone: string; code: string }) {
    // Verify OTP
    const isValid = await this.authService.verifyCode(phone, code);
    if (!isValid) {
      return { message: 'Invalid verification code', success: false };
    }

    // Find user by phone
    let user = await this.usersService.findByPhone(phone);

    // If user doesn't exist, return error
    if (!user) {
      return { message: 'User not found', success: false };
    }

    // Mark user as verified
    user.isVerified = true;
    await this.usersService.updateUserVerificationStatus(phone, true);

    // Generate JWT
    const token = await this.authService.generateJwtToken(user);
    return {
      message: 'Login successful',
      accessToken: token,
      user,
    };
  }

  // ارسال کد لاگین به شماره تلفن (در صورت وجود کاربر)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async sendLoginCode(@Body() { phone }: { phone: string }) {
    // تولید کد تایید (OTP)
    const otp = await this.authService.generateVerificationCode(phone);

    // بررسی وجود کاربر
    let user = await this.usersService.findByPhone(phone);
    if (!user) {
      // اگر کاربر یافت نشد، کاربر موقت ایجاد شود (همانند مرحله ثبت‌نام)
      const otpExpiryTime = Date.now() + 10 * 60 * 1000; // انقضای 10 دقیقه
      await this.usersService.createTemporaryUser(phone, otp, otpExpiryTime);
    }

    // ارسال کد تایید به کاربر
    await this.smsService.sendVerificationCode(phone, otp);
    return { message: 'Login code sent to phone number' };
  }

  // تایید کد لاگین و ورود کاربر
  @Post('login-confirm')
  @HttpCode(HttpStatus.OK)
  async loginConfirm(@Body() { phone, code }: { phone: string; code: string }) {
    // تایید کد
    const isValid = await this.authService.verifyCode(phone, code);
    if (!isValid) {
      return { message: 'Invalid verification code', success: false };
    }

    // پیدا کردن کاربر
    let user = await this.usersService.findByPhone(phone);

    // اگر کاربر یافت نشد، ثبت‌نام جدید انجام شود
    if (!user) {
      user = await this.authService.register({ phone });
    }

    // به‌روزرسانی وضعیت تایید کاربر
    user = await this.usersService.updateUserVerificationStatus(phone, true);

    // تولید توکن JWT
    const token = await this.authService.generateJwtToken(user);
    return {
      message: 'Login successful',
      accessToken: token,
      user,
    };
  }
}
