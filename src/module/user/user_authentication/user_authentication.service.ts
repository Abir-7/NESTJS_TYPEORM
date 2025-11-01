import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AuthenticationType,
  UserAuthentication,
} from './entities/user_authentication.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserAuthenticationService {
  @InjectRepository(UserAuthentication)
  private readonly userAuthRepo: Repository<UserAuthentication>;
  async create_new(
    user_id: string,
    code: string,
    expire_date: Date,
    type: AuthenticationType,
  ) {
    const newAuth = this.userAuthRepo.create({
      expire_date,
      code,
      user: { id: user_id },
      type,
    });
    return await this.userAuthRepo.save(newAuth);
  }
  async findOneWithIdAndCode(id: string, code: string) {
    const user_authentication_data = await this.userAuthRepo.findOne({
      where: { user: { id: id }, code },
      relations: ['user'],
    });
    return user_authentication_data;
  }
  async findOneWithId(id: string) {
    const user_authentication_data = await this.userAuthRepo.findOne({
      where: { user: { id: id } },
      order: { created_at: 'DESC' },
    });
    return user_authentication_data;
  }
  update(id: number, updateUserAuthenticationDto: any) {
    console.log(updateUserAuthenticationDto);
    return `This action updates a #${id} userAuthentication`;
  }
}
