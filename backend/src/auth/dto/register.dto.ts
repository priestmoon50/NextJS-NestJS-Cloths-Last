import { IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'Username must be a string' })
  username: string;

  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Please provide a valid international phone number' })
  phone: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}