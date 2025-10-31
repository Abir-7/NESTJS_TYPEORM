import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateUserWithProfileDto extends CreateUserDto {
  // Profile fields
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  image_id?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  zip_code?: string;

  @IsOptional()
  @IsDateString({}, { message: 'date_of_birth must be a valid date string' })
  date_of_birth?: string;
}
