import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { getModelToken } from '@nestjs/mongoose';
import { Cart } from './cart.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

const mockCartModel = {
  create: jest.fn().mockImplementation((dto) => dto), // شبیه‌سازی create
  findById: jest.fn(), // شبیه‌سازی findById
  findOne: jest.fn(), // شبیه‌سازی findOne
  save: jest.fn().mockResolvedValue({}), // شبیه‌سازی save
};

describe('CartService', () => {
  let service: CartService;
  let model: Model<Cart>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: getModelToken(Cart.name), useValue: mockCartModel }, // شبیه‌سازی مدل Cart
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    model = module.get<Model<Cart>>(getModelToken(Cart.name));
  });

  afterEach(() => {
    jest.clearAllMocks(); // پاکسازی mock ها بعد از هر تست
  });

  it('should create a new cart', async () => {
    const newCart = { 
      userId: '123', 
      cartId: 'some-cart-id', // یک مقدار mock برای cartId
      products: [], 
      status: 'active', 
      totalPrice: 0 
    };
  
    mockCartModel.create.mockResolvedValue(newCart);
  
    const result = await service.createCart('123');
    
    expect(result).toEqual(newCart);
    expect(mockCartModel.create).toHaveBeenCalledWith({
      userId: '123',
      cartId: expect.any(String), // انتظار داریم cartId به صورت یکتا تولید شود
      products: [],
      status: 'active',
      totalPrice: 0,
    });
  });

  it('should add a product to the cart', async () => {
    const cart = { 
      products: [], 
      totalPrice: 0, 
      save: jest.fn().mockResolvedValue(this) // شبیه‌سازی save
    };

    // شبیه‌سازی findOne
    mockCartModel.findOne.mockResolvedValue(cart);

    const product = { 
      productId: '123', 
      quantity: 2, 
      price: 50, 
      name: 'Sample Product', 
      imageUrl: 'http://example.com/image.jpg'
    };

    await service.addProductToCart('123', product);

    expect(cart.products).toContainEqual(product); // بررسی اضافه شدن محصول
    expect(cart.totalPrice).toBe(100); // بررسی محاسبه قیمت کل
    expect(cart.save).toHaveBeenCalled(); // بررسی فراخوانی save
  });

  it('should remove a product from the cart', async () => {
    const cart = {
      products: [{ productId: '123', quantity: 1, price: 100 }],
      totalPrice: 100,
      save: jest.fn().mockResolvedValue(this), // شبیه‌سازی save
    };

    // شبیه‌سازی findOne
    mockCartModel.findOne.mockResolvedValue(cart);

    await service.removeProductFromCart('123', '123');

    expect(cart.products).toHaveLength(0); // بررسی حذف محصول
    expect(cart.totalPrice).toBe(0); // بررسی محاسبه قیمت کل
    expect(cart.save).toHaveBeenCalled(); // بررسی فراخوانی save
  });

  it('should throw an error if cart is not found', async () => {
    
    // شبیه‌سازی بازگشت null برای findOne
    mockCartModel.findOne.mockResolvedValue(null);

    await expect(service.addProductToCart('123', {
      productId: '123',
      quantity: 1,
      price: 100,
      name: 'Sample Product',
      imageUrl: 'http://example.com/image.jpg'
    })).rejects.toThrow(NotFoundException); // انتظار داریم خطا رخ دهد
  });
});
