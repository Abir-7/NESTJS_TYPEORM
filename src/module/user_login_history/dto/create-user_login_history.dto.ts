import {
  IsString,
  IsOptional,
  IsUUID,
  MaxLength,
  IsBoolean,
} from 'class-validator';

class UserIdDto {
  @IsString()
  id: string;
}

export class CreateUserLoginHistoryDto {
  @IsUUID()
  user: UserIdDto;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  ip_address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  device?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsBoolean()
  is_success: boolean;
}
