import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let authService: AuthService;

  const mockUser = {
    _id: 'user123',
    email: 'test@example.com',
    username: 'testuser',
  };

  const mockUsersService = {
    findAll: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
  };

  const mockAuthService = {
    validateUser: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: AuthService, useValue: mockAuthService },
        JwtService,
        JwtStrategy, // اضافه کردن JwtStrategy
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn().mockReturnValue(true) }) // شبیه‌سازی JWT Guard
      .compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should return all users', async () => {
    const result = await usersController.findAll();
    expect(result).toEqual([mockUser]);
    expect(usersService.findAll).toHaveBeenCalled();
  });

  it('should return one user', async () => {
    const result = await usersController.findOne('user123');
    expect(result).toEqual(mockUser);
    expect(usersService.findOne).toHaveBeenCalledWith('user123');
  });
});
