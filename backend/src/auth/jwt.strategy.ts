import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { JwtPayload } from './jwt-payload.interface'; // درست وارد کردن jwt-payload.interface

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'secretKey', // کلید JWT باید تعریف شود
    });
  }

  async validate(payload: JwtPayload) {
    console.log('JWT Payload:', payload);  // بررسی payload
    const user = await this.authService.validateUser(payload);
    if (!user) {
      console.log('Invalid token or user not found');  // بررسی مشکل
      throw new UnauthorizedException('Invalid token or user not found');
    }
    return user; // اینجا می‌توانید اطلاعات خاص کاربر یا فیلتر شده را برگردانید
  }
}
