import { Controller, Get, Patch, Param, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // وارد کردن JwtAuthGuard
import { Request } from 'express'; // وارد کردن Request برای استفاده از @Req

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  // دریافت اطلاعات کاربر از طریق توکن JWT
  @UseGuards(JwtAuthGuard)  // احراز هویت با JWT
  @Get('account')  // مسیر دریافت اطلاعات کاربر
  @HttpCode(HttpStatus.OK)
  async getAccountInfo(@Req() req: Request) {
    const userId = req.user['userId'];  // دریافت userId از JWT
    const user = await this.usersService.findOne(userId);
    
    // بازگرداندن اطلاعات کاربر حتی اگر خالی باشند
    return {
      message: 'User retrieved successfully',
      phone: user.phone,
      email: user.email || '',  // اگر خالی است، یک مقدار پیش‌فرض (مثل رشته خالی) برگردانید
      address: user.address || '',
      fullname: user.fullname || '',
      role: user.role || 'user'
    };
  }

  
// با استفاده از role میتونیم هر کدوم از کاربر هایی رو که خواستیم به  بهشون role ادمین بدیم تا به بقیه بخش های admin panel دسترسی داشته باشند
  @Patch('assign-role/:id')
  @HttpCode(HttpStatus.OK)
  async assignRole(
    @Param('id') id: string,  
    @Body() roleData: { role: 'user' | 'admin' },  
  ) {
    const updatedUser = await this.usersService.assignRole(id, roleData.role);
    return {
      message: 'User role updated successfully',
      user: updatedUser,
      role: updatedUser.role  // اضافه کردن نقش جدید به پاسخ
    };
  }



  // دریافت اطلاعات کاربر با استفاده از ID
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return {
      message: 'User retrieved successfully',
      user,
    };
  }

  // دریافت اطلاعات کاربر با استفاده از شماره تلفن
  @Get('phone/:phone')
  @HttpCode(HttpStatus.OK)
  async getUserByPhone(@Param('phone') phone: string) {
    const user = await this.usersService.findByPhone(phone);
    return {
      message: 'User retrieved successfully by phone',
      user,
    };
  }

  // بروزرسانی اطلاعات کاربر (مثلا شماره تلفن)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string, 
    @Body() updateUserData: { phone?: string, email?: string, address?: string, fullname?: string }, // فیلدهای اضافی برای بروزرسانی
  ) {
    const updatedUser = await this.usersService.update(id, updateUserData);
    return {
      message: 'User updated successfully',
      user: updatedUser,
    };
  }

  // بروزرسانی وضعیت تایید کاربر (isVerified)
  @Patch('verify/:phone')
  @HttpCode(HttpStatus.OK)
  async updateVerificationStatus(
    @Param('phone') phone: string,
    @Body() verificationData: { isVerified: boolean }, // دریافت وضعیت تایید از درخواست
  ) {
    const updatedUser = await this.usersService.updateUserVerificationStatus(phone, verificationData.isVerified);
    return {
      message: 'User verification status updated successfully',
      user: updatedUser,
    };
  }
}
