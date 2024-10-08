import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // ایجاد کاربر جدید با هش کردن رمز عبور
  async create(userData: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userModel.findOne({ phone: userData.phone }).exec();
      if (existingUser) {
        throw new ConflictException('Phone number already registered.');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const createdUser = new this.userModel({
        ...userData,
        password: hashedPassword,
      });
      return await createdUser.save();
    } catch (error) {
      throw new NotFoundException('Failed to create user. Please try again.');
    }
  }

  // یافتن تمام کاربران
  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      throw new NotFoundException('Failed to fetch users.');
    }
  }

  // یافتن کاربر بر اساس ID
  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
      return user;
    } catch (error) {
      throw new NotFoundException(`Failed to fetch user with ID ${id}.`);
    }
  }

  // بروزرسانی اطلاعات کاربر
  async update(id: string, userData: UpdateUserDto): Promise<User> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(id, userData, { new: true }).exec();
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found for update.`);
      }
      return updatedUser;
    } catch (error) {
      throw new NotFoundException(`Failed to update user with ID ${id}.`);
    }
  }

  // حذف کاربر
  async remove(id: string): Promise<User> {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
      if (!deletedUser) {
        throw new NotFoundException(`User with ID ${id} not found for deletion.`);
      }
      return deletedUser;
    } catch (error) {
      throw new NotFoundException(`Failed to delete user with ID ${id}.`);
    }
  }

  // یافتن کاربر بر اساس شماره تلفن
  async findByPhone(phone: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ phone }).exec();
      if (!user) {
        throw new NotFoundException(`User with phone number ${phone} not found.`);
      }
      return user;
    } catch (error) {
      throw new NotFoundException(`Failed to find user with phone number ${phone}.`);
    }
  }
}
