import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SmsService } from './sms.service';
import { PhoneVerificationDto } from './dto/phone-verification.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto'; 

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly smsService: SmsService, 
  ) {}

  // متد ورود کاربر
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto.phone, loginDto.password);
    return {
      message: 'Login successful',
      accessToken: token,
    };
  }

  // متد ارسال کد تایید به شماره تلفن
  @Post('verify-phone')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async verifyPhone(@Body() phoneVerificationDto: PhoneVerificationDto) {
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    await this.smsService.sendVerificationCode(phoneVerificationDto.phone, verificationCode);
    await this.authService.saveVerificationCode(phoneVerificationDto.phone, verificationCode);
    return { message: 'Verification code sent' };
  }
  

  // متد تایید کد و بررسی ثبت نام
  @Post('confirm-code')
  @HttpCode(HttpStatus.OK)
  async confirmCode(@Body() { phone, code }: { phone: string; code: string }) {
    const isValid = await this.authService.verifyCode(phone, code);  
    if (!isValid) {
      return { message: 'Invalid verification code', success: false };
    }

    const user = await this.authService.findByPhone(phone);
    if (user) {
      const token = await this.authService.generateJwtToken(user);
      return {
        message: 'Login successful',
        accessToken: token,
        user,
      };
    } else {
      return { message: 'Phone number not registered. Proceed to registration.', success: true };
    }
  }

  // متد ثبت نام کاربر بعد از تایید شماره تلفن
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() registerDto: RegisterDto) {
    const userExists = await this.authService.findByPhone(registerDto.phone);
    if (userExists) {
      return { message: 'Phone number already registered.', success: false };
    }

    const newUser = await this.authService.register(registerDto);
    const token = await this.authService.generateJwtToken(newUser);
    return {
      message: 'Registration successful',
      accessToken: token,
      user: newUser,
    };
  }
}
