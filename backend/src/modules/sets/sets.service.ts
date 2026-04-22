import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SetEntity } from './entities/set.entity';
import { CreateSetDto } from './dto/create-set.dto';
import {
  STORAGE_PROVIDER_TOKEN,
  type IStorageProvider,
} from '../storage/storage.interface';
import { SlugService } from '../../shared/services/slug.service';

@Injectable()
export class SetsService {
  constructor(
    @InjectRepository(SetEntity)
    private readonly setRepository: Repository<SetEntity>,

    @Inject(STORAGE_PROVIDER_TOKEN)
    private readonly storageProvider: IStorageProvider,

    private readonly slugService: SlugService,
  ) {}

  async createSet(
    file: Express.Multer.File,
    createSetDto: CreateSetDto,
  ): Promise<SetEntity> {
    // 1. Limpiar el nombre del archivo para evitar problemas en MinIO/S3
    const cleanFileName = this.slugService.cleanFileName(file.originalname);

    // Sobrescribimos el nombre en memoria para que MinIO lo guarde limpio
    file.originalname = cleanFileName;

    // 2. Subir el archivo físico a MinIO
    const fileKey = await this.storageProvider.uploadFile(file, 'dex-sets');

    // 3. Crear el registro para la Base de Datos
    const newSet = this.setRepository.create({
      title: createSetDto.title,
      description: createSetDto.description,
      filename: cleanFileName,
      audioUrl: fileKey,
      audioSize: file.size,
      // El 'status' se pone en PENDING por defecto gracias a nuestra SetEntity
    });

    // 4. Guardar en PostgreSQL y retornar el resultado
    return await this.setRepository.save(newSet);
  }
}
