/* eslint-disable @typescript-eslint/no-unused-vars */

// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { IMessageResponse } from '../../../types/response/auth_service_response.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepo.find();
  }

  async findAllWithProfile(): Promise<User[]> {
    return await this.userRepo.find({
      select: {
        id: true,
        email: true,
        role: true,
        account_status: true,
        is_verified: true,
        is_profile_updated: true,
        profile: true,
        // don't include password
      },
      relations: ['profile'], // load profile
    });
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { email: email } });
    if (!user) {
      throw new NotFoundException(`User with email: ${email} not found`);
    }
    return user;
  }

  async findOneWithProfile(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        account_status: true,
        is_verified: true,
        is_profile_updated: true,
        profile: true,
        // don't include password
      },
      relations: ['profile'], // load profile
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async remove(id: string): Promise<IMessageResponse> {
    const user = await this.findOneById(id); // throws if not found
    await this.userRepo.remove(user);
    return { message: `User with ID ${id} has been removed` };
  }
}
