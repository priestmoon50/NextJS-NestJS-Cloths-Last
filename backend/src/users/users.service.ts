import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name); // استفاده از Logger برای لاگ‌ها

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // ایجاد کاربر جدید فقط با شماره تلفن
  async create(userData: { phone: string }): Promise<User> {
    try {
      const existingUser = await this.userModel.findOne({ phone: userData.phone }).exec();
      if (existingUser) {
        throw new ConflictException('Phone number already registered.');
      }

      // ایجاد کاربر جدید با شماره تلفن
      const createdUser = new this.userModel({ phone: userData.phone });
      return await createdUser.save();
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`);
      throw new NotFoundException('Failed to create user. Please try again.');
    }
  }

  // یافتن تمام کاربران
  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      this.logger.error(`Failed to fetch users: ${error.message}`);
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
      this.logger.error(`Failed to fetch user with ID ${id}: ${error.message}`);
      throw new NotFoundException(`Failed to fetch user with ID ${id}.`);
    }
  }

  // بروزرسانی اطلاعات کاربر
  async update(id: string, userData: { phone?: string }): Promise<User> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(id, userData, { new: true }).exec();
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found for update.`);
      }
      return updatedUser;
    } catch (error) {
      this.logger.error(`Failed to update user with ID ${id}: ${error.message}`);
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
      this.logger.error(`Failed to delete user with ID ${id}: ${error.message}`);
      throw new NotFoundException(`Failed to delete user with ID ${id}.`);
    }
  }

  // ایجاد کاربر موقت همراه با OTP و زمان انقضا
  async createTemporaryUser(phone: string, otp: string, otpExpiryTime: number): Promise<User> {
    const existingUser = await this.userModel.findOne({ phone }).exec();
    if (existingUser) {
      throw new ConflictException('Phone number already registered.');
    }

    // ایجاد کاربر جدید با OTP و زمان انقضا
    const createdUser = new this.userModel({
      phone,
      otp, // ذخیره کد تایید هش شده
      otpExpiryTime,
      isVerified: false, // کاربر تایید نشده است
    });

    try {
      return await createdUser.save();
    } catch (error) {
      this.logger.error(`Failed to create temporary user: ${error.message}`);
      throw new NotFoundException('Failed to create temporary user.');
    }
  }

  // به‌روزرسانی OTP و زمان انقضا برای کاربر موجود
  async updateUserOtp(phone: string, otp: string, otpExpiryTime: number): Promise<User> {
    const user = await this.userModel.findOne({ phone }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // به‌روزرسانی کد OTP و زمان انقضا
    user.otp = otp;
    user.otpExpiryTime = otpExpiryTime;

    try {
      return await user.save();
    } catch (error) {
      this.logger.error(`Failed to update OTP for phone: ${phone}`);
      throw new NotFoundException('Failed to update OTP.');
    }
  }

  // به‌روزرسانی وضعیت تایید کاربر
  async updateUserVerificationStatus(phone: string, isVerified: boolean): Promise<User> {
    try {
      const user = await this.userModel.findOne({ phone }).exec();
      if (!user) {
        throw new NotFoundException(`User with phone number ${phone} not found.`);
      }
      user.isVerified = isVerified;
      return await user.save();
    } catch (error) {
      this.logger.error(`Failed to update verification status for phone: ${phone}`);
      throw new NotFoundException(`Failed to update verification status.`);
    }
  }

  // یافتن کاربر بر اساس شماره تلفن
  async findByPhone(phone: string): Promise<User> {
    try {
      this.logger.log(`Searching user by phone: ${phone}`);
      const user = await this.userModel.findOne({ phone }).exec();
      if (!user) {
        this.logger.warn(`User with phone number ${phone} not found.`);
        throw new NotFoundException(`User with phone number ${phone} not found.`);
      }
      this.logger.log(`User found for phone number ${phone}`);
      return user;
    } catch (error) {
      this.logger.error(`Error finding user with phone number ${phone}: ${error.message}`);
      throw new NotFoundException(`Failed to find user with phone number ${phone}.`);
    }
  }
}
