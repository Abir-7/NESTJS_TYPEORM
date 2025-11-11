import { IsString, IsNotEmpty, MinLength, IsUUID } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(6, { message: 'Password must be at least 8 characters long' })
  new_password: string;

  @IsString()
  @IsNotEmpty({ message: 'Confirm password is required' })
  @MinLength(6, { message: 'Password must be at least 8 characters long' })
  confirm_password: string;

  @IsUUID()
  @IsNotEmpty({ message: 'User ID is required' })
  user_id: string;

  @IsString()
  @IsNotEmpty({ message: 'Token is required' })
  token: string;
}
