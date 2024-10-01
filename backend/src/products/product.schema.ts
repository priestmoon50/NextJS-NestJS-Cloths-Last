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
  sizes: any; // تغییر به `sizes`

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  colors: any; // فیلدی انعطاف‌پذیر برای رنگ‌ها

  @Prop({ required: true })
  category: string; // کتگوری
}

export const ProductSchema = SchemaFactory.createForClass(Product);
