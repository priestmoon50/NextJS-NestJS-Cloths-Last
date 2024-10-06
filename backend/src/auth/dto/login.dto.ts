import { IsString, MinLength, Matches } from 'class-validator';

export class LoginDto {
  [x: string]: string;

  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Please provide a valid phone number' })
  phone: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}