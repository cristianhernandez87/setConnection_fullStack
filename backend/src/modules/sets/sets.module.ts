import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../storage/storage.module';
import { SetEntity } from './entities/set.entity';
import { SlugService } from 'src/shared/services/slug.service';
import { SetsService } from './sets.service';
// 1. IMPORTAMOS EL CONTROLADOR AQUÍ
import { SetsController } from './sets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SetEntity]), StorageModule],
  // 2. LO METEMOS EN EL ARREGLO DE CONTROLADORES DE SU MÓDULO
  controllers: [SetsController],
  providers: [SetsService, SlugService],
})
export class SetsModule {}
