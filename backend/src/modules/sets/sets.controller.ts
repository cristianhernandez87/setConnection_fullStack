import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateSetDto } from './dto/create-set.dto';
import { SetsService } from './sets.service';

@Controller('sets')
export class SetsController {
  constructor(private readonly setsService: SetsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSet(
    // 1. Validamos el archivo (que sea audio y no pese más de 200MB)
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 200 }),
          new FileTypeValidator({ fileType: '.(mp3|wav|mpeg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    // 2. Validamos los campos de texto con nuestro DTO
    @Body() createSetDto: CreateSetDto,
  ) {
    // Subimos el archivo a MinIO
    const savedSet = await this.setsService.createSet(file, createSetDto);

    return {
      message: '¡Set subido y guardado exitosamente!',
      data: savedSet,
    };
  }
}
