import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; 
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UsersModule), // استفاده از forwardRef برای جلوگیری از وابستگی‌های چرخشی
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecretKey', // استفاده از متغیر محیطی برای کلید امنیتی
      signOptions: { 
        expiresIn: process.env.JWT_EXPIRES_IN || '1h', // استفاده از متغیر محیطی برای مدت اعتبار توکن
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}