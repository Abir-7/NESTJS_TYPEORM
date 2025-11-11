import { ConfigService } from '@nestjs/config';
import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { UserProfileService } from './user_profile.service';
import { UpdateUserProfileDto } from './dto/update-user_profile.dto';
import { ParseUUIDPipe } from '@nestjs/common';

import { MulterModule } from '../../../middleware/multer.module';

import { formatFilePath } from '../../../utils/helper/formatFilePath';
import { ParseJsonPipe } from '../../../common/pipe/parse_data.pipe';
import { AuthGuard } from '../../../middleware/auth.guard';
import { RolesGuard } from '../../../middleware/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorators';
import { UserRole } from '../user/entities/user.entity';

import { User } from '../../../common/decorators/user.decorator';
import type { IAuthData } from '../../../types/auth/auth_data.interface';
//import { deleteFile } from '../../../utils/helper/deleteDiskFile';
//import { deleteFile } from '../../../utils/helper/deleteDiskFile';

@Controller('user-profile')
export class UserProfileController {
  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  findAll() {
    return this.userProfileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userProfileService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  @Patch()
  @UseInterceptors(MulterModule.uploadInterceptor('file', 20 * 1024 * 1024)) // 20MB limit
  update(
    @UploadedFile() file: Express.Multer.File,
    @User() user: IAuthData,
    @Body(
      'data',
      ParseJsonPipe,
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    profileData: UpdateUserProfileDto,
  ) {
    const image = `${this.configService.getOrThrow('BASE_URL')}${formatFilePath(file.path)}`;
    const image_id = formatFilePath(file.path);
    // deleteFile(image_id);

    const profile_data = { ...profileData, image, image_id };

    return this.userProfileService.updateProfile(user.user_id, profile_data);
  }
}
