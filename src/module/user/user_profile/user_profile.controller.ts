import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { UserProfileService } from './user_profile.service';
import { UpdateUserProfileDto } from './dto/update-user_profile.dto';
import { ParseUUIDPipe } from '@nestjs/common';

@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  // Get all profiles
  @Get()
  findAll() {
    return this.userProfileService.findAll();
  }

  // Get a single profile by UUID
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userProfileService.findOne(id);
  }

  // Update a profile by UUID
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.userProfileService.update(id, updateUserProfileDto);
  }
}
