import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user/entities/user.entity';
import { UserProfile } from '../user/user_profile/entities/user_profile.entity';
import { UserAuthentication } from '../user/user_authentication/entities/user_authentication.entity';

import { UserModule } from '../user/user/user.module';
import { DatabaseModule } from '../../database/database.module';
import { UserAuthenticationModule } from '../user/user_authentication/user_authentication.module';

import { QueueModule } from '../../lib/queue/queue.module';
import { UserAuthenticationFailLog } from '../user/user_authentication_fail_log/entities/user_authentication_fail_log.entity';
import { UserAuthenticationFailLogModule } from '../user/user_authentication_fail_log/user_authentication_fail_log.module';
import { AuthUtils } from './auth.utils';

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
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthUtils],
})
export class AuthModule {}
