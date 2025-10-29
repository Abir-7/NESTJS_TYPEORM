import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserProfileDto } from './dto/update-user_profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from './entities/user_profile.entity';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
  ) {}

  // Get all profiles
  async findAll(): Promise<UserProfile[]> {
    return await this.userProfileRepository.find({ relations: ['user'] });
  }

  // Get single profile by UUID
  async findOne(id: string): Promise<UserProfile> {
    const profile = await this.userProfileRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException(`UserProfile with id ${id} not found`);
    }
    return profile;
  }

  // Update profile by UUID
  async update(
    id: string,
    updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<UserProfile> {
    const profile = await this.findOne(id); // throws NotFoundException if not found
    Object.assign(profile, updateUserProfileDto);
    return await this.userProfileRepository.save(profile);
  }
}
