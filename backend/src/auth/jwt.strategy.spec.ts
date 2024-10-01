import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let authService: AuthService;

  const mockUser = {
    _id: 'user123',
    email: 'test@example.com',
    username: 'testuser',
  };

  const mockAuthService = {
    validateUser: jest.fn().mockResolvedValue(mockUser), // شبیه‌سازی سرویس احراز هویت
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy, // تزریق JwtStrategy
        { provide: AuthService, useValue: mockAuthService }, // تزریق AuthService با شبیه‌سازی متد validateUser
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy); // دریافت JwtStrategy از تست ماژول
    authService = module.get<AuthService>(AuthService); // دریافت AuthService از تست ماژول
  });

  // تست برای اعتبارسنجی موفق
  it('should validate user with valid payload', async () => {
    const payload = { userId: 'user123', email: 'test@example.com', username: 'testuser' }; // Payload شبیه‌سازی شده
    const result = await jwtStrategy.validate(payload);
    
    expect(result).toEqual(mockUser); // بررسی اینکه کاربر بازگشتی مطابق با mockUser باشد
    expect(authService.validateUser).toHaveBeenCalledWith(payload); // بررسی اینکه validateUser با payload صحیح فراخوانی شده است
  });
  
  // تست برای وضعیت عدم اعتبار
  it('should throw UnauthorizedException if user is not valid', async () => {
    mockAuthService.validateUser.mockResolvedValue(null); // شبیه‌سازی عدم اعتبار کاربر
    const payload = { userId: 'invalid', email: 'invalid@example.com', username: 'invalid' }; // Payload نامعتبر

    await expect(jwtStrategy.validate(payload)).rejects.toThrow(UnauthorizedException); // بررسی اینکه exception پرتاب می‌شود
  });
});
