import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.schema';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProduct: Product = {
    _id: '1',
    name: 'Test Product',
    price: 100,
    description: 'Test Description',
    discount: 0,
    color: 'red',
    size: ['S', 'M'],
    category: 'test-category',
  } as any;

  const mockProductsService = {
    create: jest.fn().mockResolvedValue(mockProduct),
    findAll: jest.fn().mockResolvedValue([mockProduct]),
    findOne: jest.fn().mockResolvedValue(mockProduct),
    update: jest.fn().mockResolvedValue(mockProduct),
    remove: jest.fn().mockResolvedValue(mockProduct),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a product', async () => {
    const result = await controller.create(mockProduct);
    expect(result).toEqual(mockProduct);
    expect(service.create).toHaveBeenCalledWith(mockProduct);
  });

  it('should return all products', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockProduct]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a single product', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual(mockProduct);
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should update a product', async () => {
    const updateData = { name: 'Updated Product' };
    const result = await controller.update('1', updateData);
    expect(result).toEqual(mockProduct);
    expect(service.update).toHaveBeenCalledWith('1', updateData);
  });

  it('should remove a product', async () => {
    const result = await controller.remove('1');
    expect(result).toEqual(mockProduct);
    expect(service.remove).toHaveBeenCalledWith('1');
  });
});
