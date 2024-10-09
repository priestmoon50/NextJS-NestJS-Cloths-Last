import { Controller, Get, Patch, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  // مثال متد برای دریافت اطلاعات پروفایل کاربر
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return {
      message: 'User retrieved successfully',
      user,
    };
  }

  // مثال متد برای بروزرسانی اطلاعات کاربر
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string, 
    @Body() updateUserData: { phone?: string }, // به جای UpdateUserDto از یک نوع مستقیم استفاده می‌کنیم
  ) {
    const updatedUser = await this.usersService.update(id, updateUserData);
    return {
      message: 'User updated successfully',
      user: updatedUser,
    };
  }
}
