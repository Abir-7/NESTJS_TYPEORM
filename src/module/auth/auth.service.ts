/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DataSource } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserProfileDto } from '../user/user_profile/dto/create-user_profile.dto';
import {
  AccountStatus,
  User,
  UserRole,
} from '../user/user/entities/user.entity';
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
import { hashPassword, verifyPassword } from '../../utils/helper/bcryptJs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly userAuthentication: UserAuthenticationService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async createUser(
    create_user_data: CreateUserDto,
    profile_data: CreateUserProfileDto,
  ): Promise<User> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const existingUser = await manager.findOne(User, {
          where: { email: create_user_data.email.toLowerCase() },
        });

        if (existingUser && !existingUser.is_verified) {
          await manager.delete(User, { id: existingUser.id });
        }

        if (existingUser && existingUser.is_verified) {
          throw new ConflictException('Email already exists');
        }

        const user = manager.create(User, {
          ...create_user_data,
          email: create_user_data.email.toLowerCase(),
          password: await hashPassword(create_user_data.password),
        });
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
        error.message || 'Failed to create user',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyUserEmail(id: string, code: string) {
    const user_auth_data = await this.userAuthentication.findOneWithIdAndCode(
      id,
      code,
    );

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

    const payload: {
      user_email: string;
      user_role: UserRole;
      user_id: string;
    } = {
      user_email: user_auth_data.user.email,
      user_role: user_auth_data.user.role,
      user_id: user_auth_data.user.id,
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: this.configService.getOrThrow('JWT_ACCESS_EXPIRES_IN'),
      secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN'),
      secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
    });

    const decoded_access_token = this.jwtService.decode(access_token);
    const decoded_refresh_token = this.jwtService.decode(access_token);

    await this.dataSource.transaction(async (manager) => {
      const result = await manager.update(
        User,
        { id },
        { is_verified: true, account_status: AccountStatus.ACTIVE },
      );

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

    return {
      access_token,
      access_token_exp: decoded_access_token.exp,
      refresh_token,
      refresh_token_exp: decoded_refresh_token.exp,
      user_id: user_auth_data.user.id,
      user_email: user_auth_data.user.email,
    };
  }

  async userLogin(email: string, password: string) {
    const user_data = await this.userService.findOneByEmail(email);
    if (!user_data) {
      throw new HttpException('Please check your email.', HttpStatus.NOT_FOUND);
    }

    if (!(await verifyPassword(password, user_data.password))) {
      throw new HttpException(
        'Please check your password.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (user_data.account_status !== AccountStatus.ACTIVE) {
      throw new HttpException(
        `Your account is ${user_data.account_status}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload: {
      user_email: string;
      user_role: UserRole;
      user_id: string;
    } = {
      user_email: user_data.email,
      user_role: user_data.role,
      user_id: user_data.id,
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: this.configService.getOrThrow('JWT_ACCESS_EXPIRES_IN'),
      secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN'),
      secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
    });

    const decoded_access_token = this.jwtService.decode(access_token);
    const decoded_refresh_token = this.jwtService.decode(access_token);
    console.log(decoded_access_token);
    return {
      access_token,
      access_token_exp: decoded_access_token.exp,
      refresh_token,
      refresh_token_exp: decoded_refresh_token.exp,
      user_id: user_data.id,
      user_email: user_data.email,
    };
  }

  async resend(user_id: string) {
    const user_auth_data = await this.userAuthentication.findOneWithId(user_id);
    if (
      user_auth_data &&
      !isExpired(user_auth_data?.expire_date) &&
      user_auth_data.is_success == false
    ) {
      throw new HttpException(
        'You can resend code after some time',
        HttpStatus.BAD_REQUEST,
      );
    }

    const new_data = await this.userAuthentication.create_new(
      user_id,
      generateRandomCode(4),
      generateExpireDate(10),
      AuthenticationType.RESEND,
    );

    if (!new_data.id) {
      throw new HttpException('Failed to resend code.', HttpStatus.BAD_REQUEST);
    }

    return { message: 'Code resend' };
  }

  async reqForgotPass(email: string) {
    const user_data = await this.userService.findOneByEmail(email);
    if (!user_data) {
      throw new NotFoundException('Please check your email');
    }
    const new_data = await this.userAuthentication.create_new(
      user_data.id,
      generateRandomCode(4),
      generateExpireDate(10),
      AuthenticationType.RESEND,
    );

    if (!new_data) {
      throw new HttpException('Something went wrong. Please try again.', 500);
    }

    return { message: 'A Code has been send to your email.' };
  }
}
