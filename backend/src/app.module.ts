import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartController } from './cart/cart.controller';
import { CartService } from './cart/cart.service';
import { CartSchema } from './cart/cart.schema';
import { OrdersController } from './order/order.controller';
import { OrdersService } from './order/orders.service';
import { OrderSchema } from './Order/order.schema';
import { ProductsService } from './products/products.service';
import { ProductsController } from './products/products.controller';
import { ProductSchema } from './products/product.schema';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UserSchema } from './users/user.schema';
import { AuthModule } from './auth/auth.module';
import { GalleryController } from './GalleryController';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'gallery'),// تغییر مسیر به پوشه گالری
      serveRoot: '/gallery',
      serveStaticOptions: {
        index: false, // جلوگیری از جستجوی فایل index.html
      },
    }),

    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nestjs-shop'),
    MongooseModule.forFeature([
      { name: 'Cart', schema: CartSchema },
      { name: 'Order', schema: OrderSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'User', schema: UserSchema },
    ]),
    AuthModule,
  ],
  controllers: [
    AppController,
    CartController,
    OrdersController,
    ProductsController,
    UsersController,
    GalleryController,
  ],
  providers: [AppService, CartService, OrdersService, ProductsService, UsersService],
})
export class AppModule {}
