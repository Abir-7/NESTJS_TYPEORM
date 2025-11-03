import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(6, { message: 'Password must be at least 8 characters long' })
  new_password: string;

  @IsString()
  @IsNotEmpty({ message: 'Confirm password is required' })
  @MinLength(6, { message: 'Password must be at least 8 characters long' })
  confirm_password: string;
}
