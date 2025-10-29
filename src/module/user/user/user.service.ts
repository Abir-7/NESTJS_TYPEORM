// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepo.create(createUserDto);
    return await this.userRepo.save(user);
  }

  // Get all users
  async findAll(): Promise<User[]> {
    return await this.userRepo.find();
  }

  // Get one user by UUID
  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });
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
