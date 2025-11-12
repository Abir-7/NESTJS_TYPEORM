import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserAuthenticationFailLogService } from './user_authentication_fail_log.service';
import { CreateUserAuthenticationFailLogDto } from './dto/create-user_authentication_fail_log.dto';

@Controller('user-authentication-fail-log')
export class UserAuthenticationFailLogController {
  constructor(
    private readonly userAuthenticationFailLogService: UserAuthenticationFailLogService,
  ) {}

  @Post()
  create(
    @Body()
    createUserAuthenticationFailLogDto: CreateUserAuthenticationFailLogDto,
  ) {
    return this.userAuthenticationFailLogService.create(
      createUserAuthenticationFailLogDto,
    );
  }

  @Get()
  findAll(@Body('user_id') user_id: string) {
    return this.userAuthenticationFailLogService.findAllOfSingleUser(user_id);
  }
}
