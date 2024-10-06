import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  // ایجاد کاربر جدید
  @Post()
  async create(@Body() userData: CreateUserDto): Promise<User> {
    return this.usersService.create(userData);
  }

  // متد ورود
  @Post('login')
  async login(@Body('phone') phone: string, @Body('password') password: string): Promise<any> {
    const user = await this.usersService.login(phone, password);
    if (!user) {
      console.log('Invalid login attempt for phone:', phone);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { phone: user.phone, sub: user._id };
    const access_token = this.jwtService.sign(payload);
    console.log('JWT generated:', access_token);

    return {
      message: 'Login successful',
      access_token,
    };
  }

  // دریافت تمام کاربران (محافظت‌شده)
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // دریافت کاربر بر اساس ID (محافظت‌شده)
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  // بروزرسانی کاربر بر اساس ID (محافظت‌شده)
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() userData: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, userData);
  }

  // حذف کاربر بر اساس ID (محافظت‌شده)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(id);
  }
}
