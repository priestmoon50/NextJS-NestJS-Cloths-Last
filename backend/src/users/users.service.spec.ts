import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UsersService } from './users.service';
import { User, UserDocument } from './user.schema';

// Mock user data
const mockUser = {
  _id: new Types.ObjectId(),
  email: 'test@example.com',
  username: 'testuser',
  password: 'password123',
} as UserDocument;

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mockUser),  // Mock create to return mockUser
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      const result = await service.create(userData);  // Call the service method to create a user

      // Check if the create method was called with correct data
      expect(model.create).toHaveBeenCalledWith(userData);

      // Ensure that the result is the mockUser object
      expect(result).toEqual(mockUser);
    });
  });

  // سایر تست‌ها...
});
