import { Module } from '@nestjs/common';
import { UserAuthenticationFailLogService } from './user_authentication_fail_log.service';
import { UserAuthenticationFailLogController } from './user_authentication_fail_log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAuthenticationFailLog } from './entities/user_authentication_fail_log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAuthenticationFailLog])],
  controllers: [UserAuthenticationFailLogController],
  providers: [UserAuthenticationFailLogService],
  exports: [UserAuthenticationFailLogService],
})
export class UserAuthenticationFailLogModule {}
