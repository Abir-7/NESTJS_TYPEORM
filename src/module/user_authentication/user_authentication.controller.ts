import { Controller } from '@nestjs/common';
import { UserAuthenticationService } from './user_authentication.service';

@Controller('user-authentication')
export class UserAuthenticationController {
  constructor(
    private readonly userAuthenticationService: UserAuthenticationService,
  ) {}
}
