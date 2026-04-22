import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SetEntity } from './entities/set.entity';
import { CreateSetDto } from './dto/create-set.dto';
import {
  STORAGE_PROVIDER_TOKEN,
  type IStorageProvider,
} from '../storage/storage.interface';
import { SlugService } from '../../shared/services/slug.service';
import { InjectQueue } from '@nestjs/bull';
import bull from 'bull';

@Injectable()
export class SetsService {
  constructor(
    @InjectRepository(SetEntity)
    private readonly setRepository: Repository<SetEntity>,

    @Inject(STORAGE_PROVIDER_TOKEN)
    private readonly storageProvider: IStorageProvider,
    private readonly slugService: SlugService,

    @InjectQueue('audio-processing-queue')
    private audioQueue: bull.Queue,
  ) {}

  async createSet(
    file: Express.Multer.File,
    createSetDto: CreateSetDto,
  ): Promise<SetEntity> {
    const cleanFileName = this.slugService.cleanFileName(file.originalname);
    file.originalname = cleanFileName;

    const fileKey = await this.storageProvider.uploadFile(file, 'dex-sets');
    const newSet = this.setRepository.create({
      title: createSetDto.title,
      description: createSetDto.description,
      filename: cleanFileName,
      audioUrl: fileKey,
      audioSize: file.size,
    });
    const savedSet = await this.setRepository.save(newSet);
    await this.audioQueue.add('analyze-audio', { setId: savedSet.id });
    return savedSet;
  }

  async getTracklist(setId: string): Promise<SetEntity> {
    const set = await this.setRepository.findOne({
      where: { id: setId },
      relations: ['markers', 'markers.sources'],
      order: {
        markers: {
          start_time: 'ASC',
        },
      },
    });

    if (!set) {
      throw new NotFoundException(`Set con ID ${setId} no encontrado`);
    }

    return set;
  }
}
