import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

const mockOrderService = {
  createOrder: jest.fn(),
  getOrdersByUser: jest.fn(),
  updateOrderStatus: jest.fn(),
};

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        { provide: OrderService, useValue: mockOrderService }, // شبیه‌سازی سرویس Order
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should create a new order', async () => {
    const order = { orderId: '12345', userId: 'user1', products: [], totalPrice: 100 };
    
    mockOrderService.createOrder.mockResolvedValue(order);

    const result = await controller.createOrder('user1', [], 100);
    expect(result).toEqual(order);
    expect(mockOrderService.createOrder).toHaveBeenCalledWith('user1', [], 100);
  });

  it('should get orders by user', async () => {
    const orders = [{ orderId: '12345', userId: 'user1', products: [], totalPrice: 100 }];
    
    mockOrderService.getOrdersByUser.mockResolvedValue(orders);

    const result = await controller.getOrdersByUser('user1');
    expect(result).toEqual(orders);
    expect(mockOrderService.getOrdersByUser).toHaveBeenCalledWith('user1');
  });

  it('should update order status', async () => {
    const order = { orderId: '12345', status: 'completed' };

    mockOrderService.updateOrderStatus.mockResolvedValue(order);

    const result = await controller.updateOrderStatus('12345', 'completed');
    expect(result).toEqual(order);
    expect(mockOrderService.updateOrderStatus).toHaveBeenCalledWith('12345', 'completed');
  });
});
