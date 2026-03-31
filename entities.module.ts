import { IsMobilePhone, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  nationalId!: string;

  @IsString()
  fullNameAr!: string;

  @IsMobilePhone()
  mobileNumber!: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
