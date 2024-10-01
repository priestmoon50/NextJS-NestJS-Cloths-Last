import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getModelToken } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let productModel: Model<Product>;

  const mockProduct: Partial<Product> = {
    _id: '1',
    name: 'Test Product',
    price: 100,
    description: 'Test Description',
    discount: 0,
    color: 'red',
    size: ['S', 'M'],
    category: 'test-category',
  };

  const mockProductModel = {
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockProduct]),
    }),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockProduct),
    }),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockProduct),
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockProduct),
    }),
    create: jest.fn().mockResolvedValue(mockProduct),
    // اضافه کردن نوع برای موک کردن توابع
  } as unknown as jest.Mock<Model<Product>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productModel = module.get<Model<Product>>(getModelToken(Product.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ... ادامه تست‌ها ...

  describe('findOne', () => {
    it('should throw NotFoundException if product not found', async () => {
      (productModel.findById as jest.Mock).mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if product not found', async () => {
      (productModel.findByIdAndUpdate as jest.Mock).mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.update('non-existent-id', { name: 'Updated Product' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if product not found', async () => {
      (productModel.findByIdAndDelete as jest.Mock).mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
