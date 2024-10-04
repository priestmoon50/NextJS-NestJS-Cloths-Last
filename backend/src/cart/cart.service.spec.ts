import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { getModelToken } from '@nestjs/mongoose';
import { Cart, CartDocument } from './cart.schema';
import { Model, Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

const mockCart = {
  cartId: '1',
  products: [],
  totalPrice: 0,
  save: jest.fn().mockResolvedValue(this), // شبیه‌سازی save
};

const mockCartModel = {
  // اصلاح شبیه‌سازی مدل برای new
  new: jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue(mockCart), // شبیه‌سازی save برای ایجاد سبد
  })),
  // اصلاح شبیه‌سازی create
  create: jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue(mockCart), // شبیه‌سازی save
  })),
  findOne: jest.fn().mockReturnValue({
    lean: jest.fn().mockResolvedValue(mockCart),
    save: jest.fn().mockResolvedValue(mockCart),
  }),
};


describe('CartService', () => {
  let service: CartService;
  let model: Model<CartDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: getModelToken(Cart.name), useValue: mockCartModel },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    model = module.get<Model<CartDocument>>(getModelToken(Cart.name));
  });

  afterEach(() => {
    jest.clearAllMocks(); // پاکسازی mock‌ها
  });

  it('should create a new cart', async () => {
    const result = await service.createCart('123');
    expect(result).toEqual(mockCart);
    expect(mockCartModel.create).toHaveBeenCalledWith({
      userId: '123',
      cartId: expect.any(String), // انتظار داریم cartId یکتا تولید شود
      products: [],
      status: 'active',
      totalPrice: 0,
    });
  });

  it('should return a cart by cartId', async () => {
    // شبیه‌سازی بازگشت یک سبد خرید
    mockCartModel.findOne.mockReturnValueOnce({
      lean: jest.fn().mockResolvedValue(mockCart), // بازگشت مقدار شبیه‌سازی‌شده با lean
    });

    const result = await service.getCart('1');
    expect(result).toEqual(mockCart); // بررسی نتیجه
    expect(mockCartModel.findOne).toHaveBeenCalledWith({ cartId: '1' }); // بررسی فراخوانی
  });

  it('should throw NotFoundException if cart is not found by cartId', async () => {
    // شبیه‌سازی عدم یافتن سبد خرید
    mockCartModel.findOne.mockReturnValueOnce({
      lean: jest.fn().mockResolvedValue(null),
    });

    await expect(service.getCart('1')).rejects.toThrow(NotFoundException);
  });

  it('should add a product to the cart', async () => {
    const product = {
      productId: new Types.ObjectId(), // استفاده از ObjectId به جای string
      quantity: 2,
      price: 50,
      name: 'Sample Product',
      imageUrl: 'http://example.com/image.jpg',
    };

    mockCartModel.findOne.mockReturnValueOnce({
      ...mockCart,
      products: [],
      save: jest.fn().mockResolvedValue({
        ...mockCart,
        products: [product],
        totalPrice: 100,
      }),
    });

    const result = await service.addProductToCart('1', product);

    expect(result.products).toContainEqual(product); // بررسی اضافه شدن محصول
    expect(result.totalPrice).toBe(100); // بررسی محاسبه قیمت کل
    expect(mockCartModel.findOne).toHaveBeenCalledWith({ cartId: '1' });
  });

  it('should throw NotFoundException if cart is not found when adding a product', async () => {
    mockCartModel.findOne.mockResolvedValueOnce(null); // شبیه‌سازی عدم یافتن کارت

    const product = {
      productId: new Types.ObjectId(), // استفاده از ObjectId به جای string
      quantity: 1,
      price: 100,
      name: 'Sample Product',
      imageUrl: 'http://example.com/image.jpg',
    };

    await expect(service.addProductToCart('1', product)).rejects.toThrow(NotFoundException);
  });

  it('should remove a product from the cart', async () => {
    const productId = new Types.ObjectId(); // استفاده از ObjectId به جای string
    const cartWithProduct = {
      ...mockCart,
      products: [{ productId, quantity: 1, price: 100 }],
      totalPrice: 100,
      save: jest.fn().mockResolvedValue({
        ...mockCart,
        products: [],
        totalPrice: 0,
      }),
    };

    mockCartModel.findOne.mockReturnValueOnce(cartWithProduct);

    const result = await service.removeProductFromCart('1', productId.toString());

    expect(result.products).toHaveLength(0); // بررسی حذف محصول
    expect(result.totalPrice).toBe(0); // بررسی محاسبه قیمت کل
    expect(cartWithProduct.save).toHaveBeenCalled(); // بررسی فراخوانی save
  });

  it('should throw NotFoundException if product is not found in cart when removing a product', async () => {
    mockCartModel.findOne.mockResolvedValueOnce(mockCart);

    await expect(service.removeProductFromCart('1', new Types.ObjectId().toString())).rejects.toThrow(NotFoundException);
  });

  it('should update product quantity in the cart', async () => {
    const productId = new Types.ObjectId(); // استفاده از ObjectId
    const cartWithProduct = {
      ...mockCart,
      products: [{ productId, quantity: 1, price: 100 }],
      totalPrice: 100,
      save: jest.fn().mockResolvedValue({
        ...mockCart,
        products: [{ productId, quantity: 2, price: 100 }],
        totalPrice: 200,
      }),
    };

    mockCartModel.findOne.mockReturnValueOnce(cartWithProduct);

    const result = await service.updateProductQuantity('1', productId.toString(), 2);

    expect(result.products[0].quantity).toBe(2); // بررسی به‌روزرسانی تعداد
    expect(result.totalPrice).toBe(200); // بررسی محاسبه قیمت کل
    expect(cartWithProduct.save).toHaveBeenCalled(); // بررسی فراخوانی save
  });

  it('should throw NotFoundException if cart or product is not found when updating quantity', async () => {
    mockCartModel.findOne.mockResolvedValueOnce(null);

    await expect(service.updateProductQuantity('1', new Types.ObjectId().toString(), 2)).rejects.toThrow(NotFoundException);
  });

  it('should clear the cart after order is placed', async () => {
    const productId = new Types.ObjectId(); // استفاده از ObjectId
    const cartWithProduct = {
      ...mockCart,
      products: [{ productId, quantity: 1, price: 100 }],
      totalPrice: 100,
      save: jest.fn().mockResolvedValue({
        ...mockCart,
        products: [],
        totalPrice: 0,
      }),
    };

    mockCartModel.findOne.mockResolvedValueOnce(cartWithProduct);

    await service.clearCart('1');

    expect(cartWithProduct.products.length).toBe(0); // بررسی خالی شدن سبد خرید
    expect(cartWithProduct.totalPrice).toBe(0); // بررسی بازنشانی قیمت کل
    expect(cartWithProduct.save).toHaveBeenCalled(); // بررسی فراخوانی save
  });
});
