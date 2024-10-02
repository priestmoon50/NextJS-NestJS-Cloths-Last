import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 0 })
  discount: number; // درصد تخفیف

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  sizes: any; // فیلد مربوط به سایزها

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  colors: any; // فیلد مربوط به رنگ‌ها

  @Prop({ required: true })
  category: string; // کتگوری

  @Prop({ type: [String], default: [] }) // اضافه کردن آرایه‌ای از URL تصاویر
  images: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
