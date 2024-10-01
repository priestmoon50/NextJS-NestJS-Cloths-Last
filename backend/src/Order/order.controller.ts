import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  async createOrder(
    @Body('userId') userId: string,
    @Body('products') products: any[],
    @Body('totalPrice') totalPrice: number,
  ) {
    return this.orderService.createOrder(userId, products, totalPrice);
  }

  @Get('user/:userId')
  async getOrdersByUser(@Param('userId') userId: string) {
    return this.orderService.getOrdersByUser(userId);
  }

  @Put('update-status/:orderId')
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body('status') status: string,
  ) {
    return this.orderService.updateOrderStatus(orderId, status);
  }

  // متد جدید برای تبدیل سبد خرید به سفارش
  @Post('convert-cart/:userId')
  async convertCartToOrder(@Param('userId') userId: string) {
    return this.orderService.convertCartToOrder(userId);
  }
}
