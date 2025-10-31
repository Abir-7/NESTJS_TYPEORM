import { Controller, Body, Patch, Param } from '@nestjs/common';
import { UserAuthenticationService } from './user_authentication.service';

@Controller('user-authentication')
export class UserAuthenticationController {
  constructor(
    private readonly userAuthenticationService: UserAuthenticationService,
  ) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserAuthenticationDto: any) {
    return this.userAuthenticationService.update(
      +id,
      updateUserAuthenticationDto,
    );
  }
}
