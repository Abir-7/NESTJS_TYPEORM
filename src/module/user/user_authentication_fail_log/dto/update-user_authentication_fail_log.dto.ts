import { PartialType } from '@nestjs/mapped-types';
import { CreateUserAuthenticationFailLogDto } from './create-user_authentication_fail_log.dto';

export class UpdateUserAuthenticationFailLogDto extends PartialType(CreateUserAuthenticationFailLogDto) {}
