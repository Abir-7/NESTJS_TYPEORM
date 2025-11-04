import { Module } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Module({})
export class MulterModule {
  /**
   * Returns a FileInterceptor configured with disk storage.
   * @param fieldName form field name (default: 'file')
   * @param maxSize maximum file size in bytes (default: 10MB)
   */
  static uploadInterceptor(
    fieldName: string = 'file',
    maxSize: number = 10 * 1024 * 1024,
  ) {
    return FileInterceptor(fieldName, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = MulterModule.getFolderByMimeType(file.mimetype);
          const path = `./uploads/${folder}`;
          fs.mkdirSync(path, { recursive: true }); // create folder if not exists
          cb(null, path);
        },
        filename: (_, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      limits: { fileSize: maxSize },
    });
  }

  /**
   * Determines folder based on MIME type
   */
  private static getFolderByMimeType(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (
      mimeType === 'application/pdf' ||
      mimeType === 'application/msword' ||
      mimeType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
      return 'doc';
    return 'other';
  }
}
