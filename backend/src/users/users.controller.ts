import { Controller, Get, Patch, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

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
    @Body() updateUserData: { phone?: string }, // استفاده از داده‌های مستقیم برای بروزرسانی
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
