import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SetsService } from './sets.service';
import { CreateSetDto } from './dto/create-set.dto';

@Controller('sets')
export class SetsController {
  constructor(private readonly setsService: SetsService) {}

  @Get()
  async getSets() {
    return await this.setsService.findAllSets();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSet(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: /(audio\/(mpeg|mp3|wav|ogg|aac|flac)|octet-stream)/i,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() createSetDto: CreateSetDto,
  ) {
    return await this.setsService.createSet(file, createSetDto);
  }

  @Get(':id/tracklist')
  async getTracklist(@Param('id', ParseUUIDPipe) id: string) {
    return await this.setsService.getTracklist(id);
  }
}