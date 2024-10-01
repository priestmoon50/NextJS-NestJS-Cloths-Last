import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { CartService } from '../cart/cart.service';  // اضافه کردن سرویس سبد خرید

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly cartService: CartService,  // اضافه کردن سرویس سبد خرید
  ) {}

  // ایجاد سفارش جدید
  async createOrder(userId: string, products: any[], totalPrice: number): Promise<Order> {
    const newOrder = await this.orderModel.create({
      orderId: new Date().getTime().toString(),
      userId,
      products,
      totalPrice,
      status: 'pending',
    });
    return newOrder;
  }

  // دریافت سفارش‌های کاربر
  async getOrdersByUser(userId: string): Promise<Order[]> {
    return this.orderModel.find({ userId }).exec();
  }

  // به‌روزرسانی وضعیت سفارش
  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const order = await this.orderModel.findOne({ orderId });
    if (order) {
      order.status = status;
      return order.save();
    }
    throw new NotFoundException('Order not found');

  }

  // تبدیل سبد خرید به سفارش (ادغام با سبد خرید)
  async convertCartToOrder(userId: string): Promise<Order> {
    // 1. دریافت سبد خرید کاربر از CartService
    const cart = await this.cartService.getCartByUser(userId);
    
    // 2. بررسی اینکه آیا سبد خرید خالی است یا نه
    if (!cart || cart.products.length === 0) {
      throw new NotFoundException('Cart is empty or not found');
    }

    // 3. ایجاد سفارش جدید با استفاده از محصولات و قیمت کل از سبد خرید
    const newOrder = await this.orderModel.create({
      orderId: new Date().getTime().toString(),
      userId,
      products: cart.products,  // محصولات موجود در سبد خرید
      totalPrice: cart.totalPrice,  // قیمت کل سبد خرید
      status: 'pending',  // وضعیت سفارش: pending
    });
 
    // 4. خالی کردن سبد خرید پس از ثبت سفارش
    await this.cartService.clearCart(userId);

    // 5. بازگشت سفارش جدید
    return newOrder;
  }
}
