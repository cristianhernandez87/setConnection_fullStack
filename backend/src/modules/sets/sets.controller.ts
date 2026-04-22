import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  Get,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateSetDto } from './dto/create-set.dto';
import { SetsService } from './sets.service';

@Controller('sets')
export class SetsController {
  constructor(private readonly setsService: SetsService) {}
  @Get(':id/tracklist')
  async getTracklist(@Param('id') id: string) {
    return await this.setsService.getTracklist(id);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 2 * 1024 * 1024 * 1024,
      },
    }),
  )
  async uploadSet(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(mp3|wav|mpeg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() createSetDto: CreateSetDto,
  ) {
    const savedSet = await this.setsService.createSet(file, createSetDto);

    return {
      message: '¡Set subido y guardado exitosamente!',
      data: savedSet,
    };
  }
}
