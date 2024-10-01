import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto'; // اضافه کردن RegisterDto

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
            logout: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return an access token on successful login', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'password' };
      const token = 'mockAccessToken';

      jest.spyOn(authService, 'login').mockResolvedValue(token);

      const result = await authController.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual({
        message: 'Login successful',
        accessToken: token,
      });
    });
  });

  describe('register', () => {
    it('should return user data on successful registration', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password',
        username: 'testuser',
      };
      const user = { id: 1, email: 'test@example.com', username: 'testuser' };

      jest.spyOn(authService, 'register').mockResolvedValue(user);

      const result = await authController.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual({
        message: 'Registration successful',
        user,
      });
    });
  });

  describe('logout', () => {
    it('should return a success message on logout', async () => {
      const result = await authController.logout();

      expect(result).toEqual({ message: 'Logout successful' });
    });
  });
});
