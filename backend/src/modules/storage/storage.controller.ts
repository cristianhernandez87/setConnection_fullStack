import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  STORAGE_PROVIDER_TOKEN,
  type IStorageProvider,
} from './storage.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/dto/register-auth.dto';

@Controller('storage')
export class StorageController {
  constructor(
    @Inject(STORAGE_PROVIDER_TOKEN)
    private readonly storageProvider: IStorageProvider,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DJ)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAudio(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        'Debes enviar un archivo de audio en la petición.',
      );
    }

    const bucketName = 'sets-audio';
    const fileKey = await this.storageProvider.uploadFile(file, bucketName);

    return {
      message: 'Archivo subido exitosamente a MinIO',
      fileKey: fileKey,
      bucket: bucketName,
      originalName: file.originalname,
      size: file.size,
    };
  }
}
