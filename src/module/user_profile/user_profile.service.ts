/* eslint-disable @typescript-eslint/no-floating-promises */
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from './entities/user_profile.entity';

import { UpdateUserProfileDto } from './dto/update-user_profile.dto';
import { deleteFile } from '../../utils/helper/deleteDiskFile';

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
    updateUserProfileData: UpdateUserProfileDto,
  ): Promise<UserProfile> {
    const profile = await this.userProfileRepository.findOneBy({
      user: { id },
    });

    if (!profile) {
      throw new NotFoundException(`User profile with id ${id} not found`);
    }
    const old_image_id = profile.image_id;

    Object.assign(profile, updateUserProfileData);

    const updated_profile = await this.userProfileRepository.save(profile);

    if (!updated_profile) {
      if (updateUserProfileData.image_id) {
        deleteFile(updateUserProfileData.image_id);
      }
      throw new HttpException(
        `User profile with id ${id} faild to update.`,
        400,
      );
    }

    if (updateUserProfileData.image_id && old_image_id) {
      deleteFile(old_image_id);
    }

    return updated_profile;
  }
}
