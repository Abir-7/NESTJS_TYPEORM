import { Module } from '@nestjs/common';
import { UserAuthenticationService } from './user_authentication.service';
import { UserAuthenticationController } from './user_authentication.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAuthentication } from './entities/user_authentication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAuthentication])],
  controllers: [UserAuthenticationController],
  providers: [UserAuthenticationService],
  exports: [UserAuthenticationService],
})
export class UserAuthenticationModule {}
