import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

describe('CartController', () => {
  let controller: CartController;
  let service: CartService;

  const mockCartService = {
    createCart: jest.fn(),
    addProductToCart: jest.fn(),
    removeProductFromCart: jest.fn(),
    getCart: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        { provide: CartService, useValue: mockCartService },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);
  });

  it('should create a new cart', async () => {
    const userId = '123';
    const result = { cartId: '123', products: [], totalPrice: 0 };
    mockCartService.createCart.mockResolvedValue(result);

    expect(await controller.createCart(userId)).toEqual(result);
  });

  it('should add product to cart', async () => {
    const cartId = '123';
    const product = { 
      productId: '123', 
      quantity: 1, 
      price: 50, 
      name: 'Sample Product',  // فیلد نام محصول
      imageUrl: 'http://example.com/image.jpg'  // فیلد URL تصویر
    };
    const result = { cartId, products: [product], totalPrice: 50 };
    mockCartService.addProductToCart.mockResolvedValue(result);
  
    expect(await controller.addProductToCart(cartId, product)).toEqual(result);
  });
  

  it('should remove product from cart', async () => {
    const cartId = '123';
    const productId = '123';
    const result = { cartId, products: [], totalPrice: 0 };
    mockCartService.removeProductFromCart.mockResolvedValue(result);

    expect(await controller.removeProductFromCart(cartId, productId)).toEqual(result);
  });
});
