import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from './entities/user_profile.entity';
import { IUserProfile } from '../../../types/user_profile.interface';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
  ) {}

  async findAll(): Promise<UserProfile[]> {
    return await this.userProfileRepository.find({ relations: ['user'] });
  }

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

  async updateProfile(
    id: string,
    updateUserProfileDto: IUserProfile,
  ): Promise<UserProfile> {
    const profile = await this.userProfileRepository.findOneBy({
      user: { id },
    });
    if (!profile) {
      throw new NotFoundException(`User profile with id ${id} not found`);
    }

    //!  delete previous image
    Object.assign(profile, updateUserProfileDto);

    // Step 3: save updated profile
    return await this.userProfileRepository.save(profile);
  }
}
