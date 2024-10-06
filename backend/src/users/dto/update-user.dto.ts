import { IsString, IsOptional, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[+\d][\d\s().-]{6,20}$/, {
    message: 'Phone number must be a valid international number',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  password?: string;
}