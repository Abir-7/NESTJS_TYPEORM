/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { DataSource } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserProfileDto } from '../user/user_profile/dto/create-user_profile.dto';
import { User } from '../user/user/entities/user.entity';
import { UserProfile } from '../user/user_profile/entities/user_profile.entity';
import {
  AuthenticationType,
  UserAuthentication,
} from '../user/user_authentication/entities/user_authentication.entity';
import { generateRandomCode } from '../../utils/helper/generateRandomCode';
import { generateExpireDate } from '../../utils/helper/generateExpireDate';
import { UserService } from '../user/user/user.service';
import { UserAuthenticationService } from '../user/user_authentication/user_authentication.service';
import { isExpired } from '../../utils/helper/checkExpireDate';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly userAuthentication: UserAuthenticationService,
  ) {}
  async createUser(
    create_user_data: CreateUserDto,
    profile_data: CreateUserProfileDto,
  ): Promise<User> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const existingUser = await manager.findOne(User, {
          where: { email: create_user_data.email },
        });

        if (existingUser && !existingUser.is_verified) {
          await manager.delete(User, { id: existingUser.id });
        }

        if (existingUser && existingUser.is_verified) {
          throw new ConflictException('Email already exists');
        }

        const user = manager.create(User, create_user_data);
        await manager.save(User, user);
        const profile = manager.create(UserProfile, {
          ...profile_data,
          user: user,
        });
        await manager.save(UserProfile, profile);

        const authentication = manager.create(UserAuthentication, {
          user: user,
          code: generateRandomCode(4),
          expire_date: generateExpireDate(10),
          type: AuthenticationType.EMAIL,
        });
        await manager.save(UserAuthentication, authentication);
        return user;
      });
    } catch (error) {
      // Fallback for unknown errors
      throw new HttpException(
        'Failed to create user',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  async verifyUserEmail(id: string, code: string) {
    const user_auth_data = await this.userAuthentication.findOne(id, code);

    if (!user_auth_data) {
      throw new HttpException('Code not matched.', HttpStatus.NOT_FOUND);
    }

    if (user_auth_data?.is_success) {
      throw new HttpException(
        'This code is already used',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (isExpired(user_auth_data.expire_date)) {
      throw new HttpException('This code is expired', HttpStatus.BAD_REQUEST);
    }

    return await this.dataSource.transaction(async (manager) => {
      const result = await manager.update(User, { id }, { is_verified: true });
      if (result.affected === 0) {
        throw new HttpException('No user found to update', 404);
      }
      const update_user_auth_data = await manager.update(
        UserAuthentication,
        { user: { id: id }, code: code },
        { is_success: true },
      );
      if (update_user_auth_data.affected === 0) {
        throw new HttpException('No user authentication record found', 404);
      }
      return result;
    });
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
