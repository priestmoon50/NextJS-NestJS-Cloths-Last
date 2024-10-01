import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartController } from './cart/cart.controller';  
import { CartService } from './cart/cart.service';  
import { CartSchema } from './cart/cart.schema';  
import { OrderController } from './order/order.controller';  
import { OrderService } from './order/order.service';  
import { OrderSchema } from './Order/order.schema';  
import { ProductsService } from './products/products.service';
import { ProductsController } from './products/products.controller';
import { ProductSchema } from './products/product.schema';  
import { UsersController } from './users/users.controller';  // اضافه کردن کنترلر کاربران
import { UsersService } from './users/users.service';  // اضافه کردن سرویس کاربران
import { UserSchema } from './users/user.schema';  // اضافه کردن مدل کاربران
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nestjs-shop'),  
    MongooseModule.forFeature([
      { name: 'Cart', schema: CartSchema },  
      { name: 'Order', schema: OrderSchema },  
      { name: 'Product', schema: ProductSchema },  
      { name: 'User', schema: UserSchema },  // ثبت مدل User در Mongoose
    ]), AuthModule,
  ],
  controllers: [AppController, CartController, OrderController, ProductsController, UsersController],  // اضافه کردن کنترلر کاربران
  providers: [AppService, CartService, OrderService, ProductsService, UsersService],  // اضافه کردن سرویس کاربران
})
export class AppModule {}
