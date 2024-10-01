import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './cart.schema';
import { CartProduct } from './cart.schema';
import { v4 as uuidv4 } from 'uuid'; // برای تولید cartId برای کاربران مهمان

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
  ) {}

  // ایجاد سبد خرید جدید برای کاربر یا مهمان
  async createCart(userId?: string): Promise<Cart> {
    const newCart = await this.cartModel.create({
      userId: userId || null, // اگر کاربر لاگین نباشد، userId برابر null است
      cartId: uuidv4(), // استفاده از uuid برای تولید cartId برای کاربران مهمان
      products: [],
      status: 'active',
      totalPrice: 0,
    });
    return newCart;
  }

  // اضافه کردن محصول به سبد خرید (با استفاده از cartId یا userId)
  async addProductToCart(cartId: string, product: CartProduct): Promise<Cart> {
    const cart = await this.cartModel.findOne({ cartId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.products.push(product);
    cart.totalPrice += product.quantity * product.price;
    return cart.save();
  }

  // حذف محصول از سبد خرید
  async removeProductFromCart(cartId: string, productId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ cartId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const productIndex = cart.products.findIndex(p => p.productId === productId);
    if (productIndex === -1) {
      throw new NotFoundException('Product not found in cart');
    }

    cart.totalPrice -= cart.products[productIndex].quantity * cart.products[productIndex].price;
    cart.products.splice(productIndex, 1);

    return cart.save();
  }

  // دریافت اطلاعات سبد خرید با استفاده از cartId یا userId
  async getCart(cartId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ cartId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }

  async getCartByUser(userId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }

  // خالی کردن سبد خرید پس از ثبت سفارش
  async clearCart(cartId: string): Promise<void> {
    const cart = await this.cartModel.findOne({ cartId });
    if (cart) {
      cart.products = []; // حذف تمام محصولات از سبد
      cart.totalPrice = 0; // بازنشانی قیمت کل
      await cart.save(); // ذخیره تغییرات
    }
  }
}
