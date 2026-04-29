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
  Res,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateSetDto } from './dto/create-set.dto';
import type { Response } from 'express';
import { SetsService } from './sets.service';
import { SpotifyPlaylistExporter } from './strategies/spotify-exporter.strategy';

@Controller('sets')
export class SetsController {
  constructor(private readonly setsService: SetsService) {}
  @Get(':id/tracklist')
  async getTracklist(@Param('id') id: string) {
    return await this.setsService.getTracklist(id);
  }
  @Get('export/login')
  exportLogin(@Res() res: Response): void {
    const spotify = new SpotifyPlaylistExporter();
    return res.redirect(spotify.getAuthUrl());
  }

  @Get('export/callback')
  async exportCallback(@Query('code') code: string) {
    try {
      const spotify = new SpotifyPlaylistExporter();
      const token = await spotify.getAccessToken(code);

      const tracksToExport = [
        'spotify:track:4cOdK2wGawNGzdIThZnd9Z',
        'spotify:track:08mNPZ6mAnTQDvNYp7v66L',
      ];

      const playlistUrl = await spotify.export(
        token,
        'Mi Set Identificado 🎧',
        tracksToExport,
      );

      return {
        message: '¡Conexión con Spotify exitosa!',
        url: playlistUrl,
      };
    } catch (error) {
      // ESTO TE MOSTRARÁ EL ERROR REAL DE SPOTIFY EN EL NAVEGADOR
      return {
        error: 'Fallo en Spotify',
        endpoint_que_fallo: error.config?.url,
        details: error.response?.data || error.message,
      };
    }
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
