import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserLoginHistoryService } from './user_login_history.service';
import { CreateUserLoginHistoryDto } from './dto/create-user_login_history.dto';

@Controller('user-login-history')
export class UserLoginHistoryController {
  constructor(
    private readonly userLoginHistoryService: UserLoginHistoryService,
  ) {}

  @Post()
  create(@Body() createUserLoginHistoryDto: CreateUserLoginHistoryDto) {
    return this.userLoginHistoryService.create(createUserLoginHistoryDto);
  }

  @Get()
  findAll() {
    return this.userLoginHistoryService.findAll();
  }
}
