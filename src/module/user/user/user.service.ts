/* eslint-disable @typescript-eslint/no-unused-vars */

// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Get all users
  async findAll(): Promise<User[]> {
    return await this.userRepo.find();
  }

  // Get all users WITH profile
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
  // Get one user by UUID (without profile)
  async findOne(id: string): Promise<User> {
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

  // Get one user by UUID WITH profile
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

  // Update a user by UUID
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id); // throws if not found
    Object.assign(user, updateUserDto);
    return await this.userRepo.save(user);
  }

  // Delete a user by UUID
  async remove(id: string): Promise<{ message: string }> {
    const user = await this.findOne(id); // throws if not found
    await this.userRepo.remove(user);
    return { message: `User with ID ${id} has been removed` };
  }
}
