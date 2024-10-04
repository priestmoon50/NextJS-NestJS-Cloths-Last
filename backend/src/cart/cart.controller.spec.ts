import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('CartController', () => {
  let cartController: CartController;
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: {
            createCart: jest.fn(),
            addProductToCart: jest.fn(),
            removeProductFromCart: jest.fn(),
            getCart: jest.fn(),
            updateProductQuantity: jest.fn(),
          },
        },
      ],
    }).compile();

    cartController = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);
  });

  it('should create a cart for a user', async () => {
    const mockCart = { cartId: '1', products: [], status: 'active', totalPrice: 0 };
    jest.spyOn(cartService, 'createCart').mockResolvedValue(mockCart);

    const userId = '123';
    const result = await cartController.createCart(userId);

    expect(result).toEqual(mockCart);
    expect(cartService.createCart).toHaveBeenCalledWith(userId);
  });

  it('should throw NotFoundException if cart creation fails', async () => {
    jest.spyOn(cartService, 'createCart').mockResolvedValue(null);

    const userId = '123';
    await expect(cartController.createCart(userId)).rejects.toThrow(NotFoundException);
  });

  it('should add a product to the cart', async () => {
    const mockCart = {
      cartId: '1',
      products: [
        { productId: new Types.ObjectId(), quantity: 1, price: 100, name: 'Product 1', imageUrl: 'http://example.com/image.jpg', selectedSize: 'M', selectedColor: 'Red' }
      ],
      status: 'active',
      totalPrice: 100
    };
    jest.spyOn(cartService, 'addProductToCart').mockResolvedValue(mockCart);

    const cartId = '1';
    const product = { 
      productId: new Types.ObjectId(),
      quantity: 1,
      price: 100,
      name: 'Product 1',
      imageUrl: 'http://example.com/image.jpg',
      selectedSize: 'M',
      selectedColor: 'Red'
    };
    const result = await cartController.addProductToCart(cartId, product);

    expect(result).toEqual(mockCart);
    expect(cartService.addProductToCart).toHaveBeenCalledWith(cartId, product);
  });

  it('should throw NotFoundException if cart is not found while adding a product', async () => {
    jest.spyOn(cartService, 'addProductToCart').mockResolvedValue(null);

    const cartId = '1';
    const product = {
      productId: new Types.ObjectId(),
      quantity: 1,
      price: 100,
      name: 'Product 1',
      imageUrl: 'http://example.com/image.jpg',
      selectedSize: 'M',
      selectedColor: 'Red'
    };
    await expect(cartController.addProductToCart(cartId, product)).rejects.toThrow(NotFoundException);
  });

  it('should remove a product from the cart', async () => {
    const mockCart = { cartId: '1', products: [], status: 'active', totalPrice: 0 };
    jest.spyOn(cartService, 'removeProductFromCart').mockResolvedValue(mockCart);

    const cartId = '1';
    const productId = new Types.ObjectId();
    const result = await cartController.removeProductFromCart(cartId, productId.toString());

    expect(result).toEqual(mockCart);
    expect(cartService.removeProductFromCart).toHaveBeenCalledWith(cartId, productId.toString());
  });

  it('should throw NotFoundException if product is not found while removing a product', async () => {
    jest.spyOn(cartService, 'removeProductFromCart').mockResolvedValue(null);

    const cartId = '1';
    const productId = new Types.ObjectId();
    await expect(cartController.removeProductFromCart(cartId, productId.toString())).rejects.toThrow(NotFoundException);
  });

  it('should return a cart by cartId', async () => {
    const mockCart = { cartId: '1', products: [], status: 'active', totalPrice: 0 };
    jest.spyOn(cartService, 'getCart').mockResolvedValue(mockCart);

    const cartId = '1';
    const result = await cartController.getCart(cartId);

    expect(result).toEqual(mockCart);
    expect(cartService.getCart).toHaveBeenCalledWith(cartId);
  });

  it('should throw NotFoundException if cart is not found', async () => {
    jest.spyOn(cartService, 'getCart').mockResolvedValue(null);

    const cartId = '1';
    await expect(cartController.getCart(cartId)).rejects.toThrow(NotFoundException);
  });

  it('should update product quantity in the cart', async () => {
    const mockCart = { cartId: '1', products: [{ productId: new Types.ObjectId(), quantity: 2, price: 100, name: 'Product 1', imageUrl: 'http://example.com/image.jpg', selectedSize: 'M', selectedColor: 'Red' }], status: 'active', totalPrice: 200 };
    jest.spyOn(cartService, 'updateProductQuantity').mockResolvedValue(mockCart);

    const cartId = '1';
    const updateData = { productId: new Types.ObjectId().toString(), quantity: 2 };
    const result = await cartController.updateProductQuantity(cartId, updateData);

    expect(result).toEqual(mockCart);
    expect(cartService.updateProductQuantity).toHaveBeenCalledWith(cartId, updateData.productId, updateData.quantity);
  });

  it('should throw NotFoundException if cart or product is not found while updating quantity', async () => {
    jest.spyOn(cartService, 'updateProductQuantity').mockResolvedValue(null);

    const cartId = '1';
    const updateData = { productId: new Types.ObjectId().toString(), quantity: 2 };
    await expect(cartController.updateProductQuantity(cartId, updateData)).rejects.toThrow(NotFoundException);
  });
});
