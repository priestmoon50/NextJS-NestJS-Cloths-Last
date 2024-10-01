import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CartProduct } from '../cart/cart.schema';

@Schema()
export class Order {
  @Prop({ required: true })
  orderId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [CartProduct], required: true })
  products: CartProduct[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: true, enum: ['pending', 'completed', 'canceled'], default: 'pending' })
  status: string; // وضعیت سفارش

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);
