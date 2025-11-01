import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserWithProfileDto } from './dto/create-user-with-profile.dto';
import { splitUserProfile } from '../../utils/helper/split-user-profile';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create_user')
  createUser(@Body() user_profile_dto: CreateUserWithProfileDto) {
    const { user, profile } = splitUserProfile(user_profile_dto);

    return this.authService.createUser(user, profile);
  }

  @Patch('verify_email/:id')
  verifyUserEmail(@Param('id') id: string, @Body('code') code: string) {
    return this.authService.verifyUserEmail(id, code);
  }

  @Post('login')
  userLogin(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.userLogin(email, password);
  }

  @Post('resend')
  resend(@Body('user_id') user_id: string) {
    return this.authService.resend(user_id);
  }
}
