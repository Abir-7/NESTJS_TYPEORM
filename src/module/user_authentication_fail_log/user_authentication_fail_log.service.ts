import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateUserAuthenticationFailLogDto } from './dto/create-user_authentication_fail_log.dto';

import { UserAuthenticationFailLog } from './entities/user_authentication_fail_log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserAuthenticationFailLogService {
  constructor(
    @InjectRepository(UserAuthenticationFailLog)
    private readonly userAuthenticationFailLogRepository: Repository<UserAuthenticationFailLog>,
  ) {}

  async create(
    createUserAuthenticationFailLogDto: CreateUserAuthenticationFailLogDto,
  ) {
    const failLog = this.userAuthenticationFailLogRepository.create(
      createUserAuthenticationFailLogDto,
    );
    return await this.userAuthenticationFailLogRepository.save(failLog);
  }

  async findAllOfSingleUser(user_id: string) {
    return await this.userAuthenticationFailLogRepository.find({
      where: { user: { id: user_id } },
    });
  }
}
