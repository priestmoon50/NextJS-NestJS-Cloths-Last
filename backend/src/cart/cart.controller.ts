import { Controller, Get, Post, Put, Param, Body , UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartProduct } from './cart.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // اضافه کردن JWT Auth Guard

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // ایجاد سبد خرید برای یک کاربر (لاگین شده یا مهمان)
  @UseGuards(JwtAuthGuard) // محافظت از این مسیر با JWT
  @Post('create/:userId')
  async createCart(@Param('userId') userId: string) {
    return this.cartService.createCart(userId);
  }

  // اضافه کردن محصول به سبد خرید
  @UseGuards(JwtAuthGuard) // محافظت از این مسیر با JWT
  @Put('add-product/:cartId')
  async addProductToCart(
    @Param('cartId') cartId: string,
    @Body() product: CartProduct,
  ) {
    return this.cartService.addProductToCart(cartId, product);
  }

  // حذف محصول از سبد خرید
  @UseGuards(JwtAuthGuard) // محافظت از این مسیر با JWT
  @Put('remove-product/:cartId/:productId')
  async removeProductFromCart(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeProductFromCart(cartId, productId);
  }

  // دریافت اطلاعات سبد خرید
  @UseGuards(JwtAuthGuard) // محافظت از این مسیر با JWT
  @Get(':cartId')
  async getCart(@Param('cartId') cartId: string) {
    return this.cartService.getCart(cartId);
  }
}

