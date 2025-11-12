import { Module } from '@nestjs/common';
import { UserLoginHistoryService } from './user_login_history.service';
import { UserLoginHistoryController } from './user_login_history.controller';
import { UserLoginHistory } from './entities/user_login_history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserLoginHistory, User])],
  controllers: [UserLoginHistoryController],
  providers: [UserLoginHistoryService],
  exports: [UserLoginHistoryService],
})
export class UserLoginHistoryModule {}
