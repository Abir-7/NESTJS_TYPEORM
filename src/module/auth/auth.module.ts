import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseModule } from '../../database/database.module';

import { QueueModule } from '../../lib/queue/queue.module';

import { AuthUtils } from './auth.utils';
import { User } from '../user/entities/user.entity';
import { UserProfile } from '../user_profile/entities/user_profile.entity';
import { UserAuthentication } from '../user_authentication/entities/user_authentication.entity';
import { UserAuthenticationFailLog } from '../user_authentication_fail_log/entities/user_authentication_fail_log.entity';
import { UserModule } from '../user/user.module';
import { UserAuthenticationModule } from '../user_authentication/user_authentication.module';
import { UserAuthenticationFailLogModule } from '../user_authentication_fail_log/user_authentication_fail_log.module';
import { UserLoginHistoryModule } from '../user_login_history/user_login_history.module';

@Module({
  imports: [
    QueueModule,
    TypeOrmModule.forFeature([
      User,
      UserProfile,
      UserAuthentication,
      UserAuthenticationFailLog,
    ]),
    UserModule,
    UserAuthenticationModule,
    DatabaseModule,
    UserAuthenticationFailLogModule,
    UserLoginHistoryModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthUtils],
})
export class AuthModule {}
