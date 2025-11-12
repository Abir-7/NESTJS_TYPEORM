import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserProfile } from '../user_profile/entities/user_profile.entity';
import { UserAuthentication } from '../user_authentication/entities/user_authentication.entity';
import { UserLoginHistory } from '../user_login_history/entities/user_login_history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserProfile,
      UserAuthentication,
      UserLoginHistory,
    ]),
  ],

  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
