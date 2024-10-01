import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  // شبیه‌سازی متدهای وابسته
  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should login user and return JWT', async () => {
    const loginDto = { email: 'testuser@example.com', password: 'testpassword' };
    
    // شبیه‌سازی بازگشت داده از دیتابیس
    const user = {
      _id: new Types.ObjectId(),
      email: 'testuser@example.com',
      password: await bcrypt.hash('testpassword', 10),
      username: 'testuser',
    };
    mockUsersService.findByEmail.mockResolvedValue(user);
    mockJwtService.sign.mockReturnValue('jwt-token');

    const result = await authService.login(loginDto);

    expect(result).toEqual({
      accessToken: 'jwt-token',
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
      },
    });
    expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
    expect(jwtService.sign).toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if user is not found', async () => {
    const loginDto = { email: 'unknown@example.com', password: 'password' };
    mockUsersService.findByEmail.mockResolvedValue(null);

    await expect(authService.login(loginDto)).rejects.toThrow('User not found');
  });

  it('should register a new user and return JWT', async () => {
    const registerDto = { email: 'newuser@example.com', password: 'newpassword', username: 'newuser' };

    // شبیه‌سازی اینکه کاربر جدید نیست
    mockUsersService.findByEmail.mockResolvedValue(null);
    mockUsersService.create.mockResolvedValue({
      _id: new Types.ObjectId(),
      email: registerDto.email,
      username: registerDto.username,
    });

    mockJwtService.sign.mockReturnValue('jwt-token');

    const result = await authService.register(registerDto);

    expect(result).toEqual({
      accessToken: 'jwt-token',
      user: {
        id: expect.any(String),  // مطمئن شدن از اینکه نوع id درست است
        email: registerDto.email,
        username: registerDto.username,
      },
    });
    expect(usersService.findByEmail).toHaveBeenCalledWith(registerDto.email);
    expect(usersService.create).toHaveBeenCalled();
    expect(jwtService.sign).toHaveBeenCalled();
  });

  it('should throw ConflictException if email is already registered', async () => {
    const registerDto = { email: 'existinguser@example.com', password: 'password', username: 'existinguser' };

    // شبیه‌سازی اینکه ایمیل از قبل وجود دارد
    mockUsersService.findByEmail.mockResolvedValue({
      email: 'existinguser@example.com',
      username: 'existinguser',
    });

    await expect(authService.register(registerDto)).rejects.toThrow('Email already registered');
  });
});
