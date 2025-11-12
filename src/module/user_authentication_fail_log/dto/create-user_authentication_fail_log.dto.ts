import {
  IsUUID,
  IsOptional,
  IsString,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
export class CreateUserAuthenticationFailLogDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  authentication_id: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  token?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  @MaxLength(45)
  ip_address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  user_agent?: string;
}
