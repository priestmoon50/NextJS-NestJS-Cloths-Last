import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class CartProduct {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  imageUrl: string;
}

@Schema({ timestamps: true })
export class Cart {
  @Prop({ required: true })
  cartId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId?: Types.ObjectId; // کاربر مهمان می‌تواند userId نداشته باشد.

  @Prop({ type: [CartProduct], default: [] })
  products: CartProduct[];

  @Prop({ required: true, enum: ['active', 'completed', 'canceled'], default: 'active' })
  status: string; // وضعیت سبد: active, completed, canceled

  @Prop({ required: true, default: 0 })
  totalPrice: number; // قیمت کل سبد خرید
}

export type CartDocument = Cart & Document;
export const CartSchema = SchemaFactory.createForClass(Cart);
