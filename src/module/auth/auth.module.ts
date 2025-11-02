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

import { EmailModule } from '../email/email.module';
import { RabbitmqModule } from '../../lib/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile, UserAuthentication]),
    UserModule,
    UserAuthenticationModule,
    DatabaseModule,
    RabbitmqModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
