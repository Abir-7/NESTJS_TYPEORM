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
} from '@nestjs/common';
import { UserProfileService } from './user_profile.service';
import { UpdateUserProfileDto } from './dto/update-user_profile.dto';
import { ParseUUIDPipe } from '@nestjs/common';

import { MulterModule } from '../../../middleware/multer.module';

import { formatFilePath } from '../../../utils/helper/formatFilePath';
import { ParseJsonPipe } from '../../../common/pipe/parse_data.pipe';
import { deleteFile } from '../../../utils/helper/deleteDiskFile';

@Controller('user_profile')
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

  @Patch(':id')
  @UseInterceptors(MulterModule.uploadInterceptor('file', 20 * 1024 * 1024)) // 20MB limit
  update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', new ParseUUIDPipe()) id: string,
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
    deleteFile(image_id);
    console.log(image);
    console.log(profileData);
    return {
      message: 'File uploaded successfully',
      image: image,
    };
  }
}
