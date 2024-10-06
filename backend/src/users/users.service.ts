import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // ایجاد کاربر جدید با استفاده از DTO
  async create(userData: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(userData);
      return await createdUser.save();
    } catch (error) {
      throw new NotFoundException('Failed to create user. Please try again.');
    }
  }

  // یافتن تمام کاربران
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // یافتن کاربر بر اساس ID
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  // بروزرسانی اطلاعات کاربر بر اساس ID
  async update(id: string, userData: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, userData, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found for update.`);
    }
    return updatedUser;
  }

  // حذف کاربر بر اساس ID
  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found for deletion.`);
    }
    return deletedUser;
  }

  // یافتن کاربر بر اساس شماره تلفن
  async findByPhone(phone: string): Promise<User> {
    const user = await this.userModel.findOne({ phone }).exec();
    if (!user) {
      throw new NotFoundException(`User with phone number ${phone} not found.`);
    }
    return user;
  }

  // ورود کاربر با شماره تلفن و رمز عبور (بدون هش)
  async login(phone: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ phone }).exec();
    if (user && user.password === password) {
      return user;  // اگر شماره تلفن و رمز عبور درست باشند، کاربر را برمی‌گرداند
    }
    throw new UnauthorizedException('Invalid phone number or password');  // در صورت اشتباه بودن اطلاعات
  }
}
