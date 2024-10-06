import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  phone: string;  // شماره تماس با پشتیبانی از فرمت‌های مختلف

  @Prop({ required: true })
  password: string;

  _id?: Types.ObjectId; // اختیاری کردن _id
}

export const UserSchema = SchemaFactory.createForClass(User);
