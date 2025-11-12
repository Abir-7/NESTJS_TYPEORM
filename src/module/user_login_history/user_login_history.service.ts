import { Injectable } from '@nestjs/common';
import { CreateUserLoginHistoryDto } from './dto/create-user_login_history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginHistory } from './entities/user_login_history.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class UserLoginHistoryService {
  constructor(
    @InjectRepository(UserLoginHistory)
    private readonly loginHistoryRepository: Repository<UserLoginHistory>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserLoginHistoryDto: CreateUserLoginHistoryDto) {
    const loginHistory = this.loginHistoryRepository.create(
      createUserLoginHistoryDto,
    );
    return this.loginHistoryRepository.save(loginHistory);
  }

  findAll() {
    return `This action returns all userLoginHistory`;
  }
}
