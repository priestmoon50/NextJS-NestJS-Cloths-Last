import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  phone: string;  // شماره تلفن به عنوان شناسه یکتا

  @Prop()  // اضافه کردن فیلد برای ذخیره کد تایید
  otp: string;

  @Prop()  // اضافه کردن فیلد برای ذخیره زمان انقضای OTP
  otpExpiryTime: number;

  @Prop({ default: false })  // اضافه کردن فیلد وضعیت تایید کاربر
  isVerified: boolean;

  _id?: Types.ObjectId; // اختیاری کردن _id
}

export const UserSchema = SchemaFactory.createForClass(User);
