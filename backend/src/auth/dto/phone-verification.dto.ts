import { IsString, Matches, IsNotEmpty } from 'class-validator';

export class PhoneVerificationDto {
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString({ message: 'Phone number must be a string' })
  @Matches(/^(\+98|0)?9\d{9}$/, { message: 'Please provide a valid Iranian phone number' }) // regex برای شماره ایران
  phone: string;
}
