/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Body,
  Patch,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserWithProfileDto } from './dto/create-user-with-profile.dto';
import { splitUserProfile } from '../../utils/helper/split-user-profile';
import { ResetPasswordDto } from './dto/reset-password.dto';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create-user')
  async createUser(@Body() user_profile_dto: CreateUserWithProfileDto) {
    const { user, profile } = splitUserProfile(user_profile_dto);

    const data = await this.authService.createUser(user, profile);

    return data;
  }

  @Patch('verify-email')
  verifyUserEmail(@Body('user_id') id: string, @Body('code') code: string) {
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

  @Patch('req_for_reset_password')
  resetPasswordReset(@Body('user_email') user_email: string) {
    return this.authService.reqForgotPass(user_email);
  }

  @Patch('verify-reset-password')
  verifyResetPasswordReq(
    @Body('user_id') user_id: string,
    @Body('code') code: string,
  ) {
    return this.authService.verifyReset(user_id, code);
  }

  @Patch('reset_password')
  resetPassword(@Body() body: ResetPasswordDto) {
    const token = body.token;
    const user_id = body.user_id;
    const new_password = body.new_password;
    const confirm_password = body.confirm_password;
    if (!token) {
      throw new Error('No token provided');
    }
    return this.authService.resetPassword(token, user_id, {
      new_password,
      confirm_password,
    });
  }

  @Post('new_access_token')
  async refreshAccessToken(
    @Req() req: Request,
    @Body() body: { refresh_token: string },
  ) {
    const refreshToken: string =
      req.cookies?.refresh_token || body.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    return await this.authService.refreshAccessToken(refreshToken);
  }
}
