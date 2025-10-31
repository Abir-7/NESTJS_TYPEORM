import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuthentication } from './entities/user_authentication.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserAuthenticationService {
  @InjectRepository(UserAuthentication)
  private readonly userAuthRepo: Repository<UserAuthentication>;
  async findOne(id: string, code: string) {
    const user_authentication_data = await this.userAuthRepo.findOne({
      where: { user: { id: id }, code },
    });
    return user_authentication_data;
  }

  update(id: number, updateUserAuthenticationDto: any) {
    console.log(updateUserAuthenticationDto);
    return `This action updates a #${id} userAuthentication`;
  }
}
