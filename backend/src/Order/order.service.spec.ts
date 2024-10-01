import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getModelToken } from '@nestjs/mongoose';
import { Order } from './order.schema';
import { CartService } from '../cart/cart.service'; // اضافه کردن سرویس سبد خرید
import { Model } from 'mongoose';

const mockOrderModel = {
  create: jest.fn().mockImplementation((dto) => dto),  // شبیه‌سازی create
  find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),  // شبیه‌سازی find با exec
  findOne: jest.fn(),  // شبیه‌سازی findOne
  save: jest.fn(),  // شبیه‌سازی save
};

const mockCartService = {
  getCartByUser: jest.fn(),  // شبیه‌سازی متد دریافت سبد خرید
  clearCart: jest.fn(),  // شبیه‌سازی متد خالی کردن سبد خرید
};

describe('OrderService', () => {
  let service: OrderService;
  let model: Model<Order>;
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: getModelToken(Order.name), useValue: mockOrderModel },  // شبیه‌سازی مدل Order
        { provide: CartService, useValue: mockCartService },  // شبیه‌سازی سرویس سبد خرید
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    model = module.get<Model<Order>>(getModelToken(Order.name));
    cartService = module.get<CartService>(CartService);  // دریافت سرویس سبد خرید
  });

  afterEach(() => {
    jest.clearAllMocks();  // پاکسازی mock‌ها بعد از هر تست
  });

  it('should create a new order', async () => {
    const newOrder = { orderId: '12345', userId: 'user1', products: [], totalPrice: 100 };
    
    mockOrderModel.create.mockResolvedValue(newOrder);

    const result = await service.createOrder('user1', [], 100);
    
    expect(result).toEqual(newOrder);
    expect(mockOrderModel.create).toHaveBeenCalledWith({
      orderId: expect.any(String),
      userId: 'user1',
      products: [],
      totalPrice: 100,
      status: 'pending',
    });
  });

  it('should get orders by user', async () => {
    const orders = [{ orderId: '12345', userId: 'user1', products: [], totalPrice: 100 }];
    
    mockOrderModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(orders) });

    const result = await service.getOrdersByUser('user1');
    
    expect(result).toEqual(orders);
    expect(mockOrderModel.find).toHaveBeenCalledWith({ userId: 'user1' });
  });

  it('should update order status', async () => {
    const order = { 
      orderId: '12345', 
      userId: 'user1', 
      products: [], 
      totalPrice: 100, 
      status: 'pending', 
      save: jest.fn().mockResolvedValue({ status: 'completed' }) 
    };

    mockOrderModel.findOne.mockResolvedValue(order);

    const result = await service.updateOrderStatus('12345', 'completed');
    
    expect(result.status).toBe('completed');
    expect(order.save).toHaveBeenCalled();
  });

  it('should throw an error if order not found', async () => {
    mockOrderModel.findOne.mockResolvedValue(null);

    await expect(service.updateOrderStatus('12345', 'completed')).rejects.toThrow('Order not found');
  });

  // تست تبدیل سبد خرید به سفارش
  it('should convert cart to order', async () => {
    const cart = { 
      userId: 'user1', 
      products: [{ productId: '123', quantity: 2, price: 50, name: 'Product', imageUrl: 'image.jpg' }], 
      totalPrice: 100 
    };
    
    const newOrder = { 
      orderId: '12345', 
      userId: 'user1', 
      products: cart.products, 
      totalPrice: cart.totalPrice, 
      status: 'pending' 
    };
  
    // شبیه‌سازی متدهای سرویس سبد خرید و سفارش
    mockCartService.getCartByUser.mockResolvedValue(cart);
    mockCartService.clearCart.mockResolvedValue(undefined);  // باید یک مقدار بازگشتی (مانند undefined) داشته باشد
    mockOrderModel.create.mockResolvedValue(newOrder);
  
    const result = await service.convertCartToOrder('user1');
    
    expect(result).toEqual(newOrder);
    expect(mockCartService.getCartByUser).toHaveBeenCalledWith('user1');
    expect(mockOrderModel.create).toHaveBeenCalledWith({
      orderId: expect.any(String),
      userId: 'user1',
      products: cart.products,
      totalPrice: cart.totalPrice,
      status: 'pending',
    });
    expect(mockCartService.clearCart).toHaveBeenCalledWith('user1');  // مطمئن شوید که با آرگومان صحیح فراخوانی شده است
  });
});
