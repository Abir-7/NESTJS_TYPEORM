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
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile, UserAuthentication]),
    UserModule,
    UserAuthenticationModule,
    DatabaseModule,
    EmailModule,
    ClientsModule.registerAsync([
      {
        name: 'EMAIL_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
            queue: configService.getOrThrow<string>('RABBITMQ_USER_QUEUE'),
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
