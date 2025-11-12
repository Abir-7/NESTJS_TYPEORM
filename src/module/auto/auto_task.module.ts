import { Module } from '@nestjs/common';
import { AutoTaskService } from './auto_task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAuthentication } from '../user_authentication/entities/user_authentication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAuthentication])],
  providers: [AutoTaskService],
})
export class AutoTaskModule {}
