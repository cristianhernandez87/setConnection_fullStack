import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../storage/storage.module';
import { SetEntity } from './entities/set.entity';
import { SlugService } from 'src/shared/services/slug.service';
import { SetsService } from './sets.service';
import { SetsController } from './sets.controller';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([SetEntity]),
    StorageModule,
    BullModule.registerQueue({
      name: 'audio-processing-queue',
    }),
  ],
  controllers: [SetsController],
  providers: [SetsService, SlugService],
})
export class SetsModule {}
