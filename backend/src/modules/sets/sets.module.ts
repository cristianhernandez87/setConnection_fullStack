import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../storage/storage.module';
import { SetEntity } from './entities/set.entity';
import { SlugService } from 'src/shared/services/slug.service';
import { SetsService } from './sets.service';
import { SetsController } from './sets.controller';
import { BullModule } from '@nestjs/bull';
import { TrackSourceEntity } from './entities/track-source.entity';
import { TrackMarkerEntity } from './entities/track-marker.entity';
import { AudioProcessingProcessor } from './audio-processing.processor';
import { SetsGateway } from './sets.gateway';
import { AnalysisGateway } from './analysis.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([SetEntity, TrackMarkerEntity, TrackSourceEntity]),
    BullModule.registerQueue({ name: 'audio-processing-queue' }),
    StorageModule,
    BullModule.registerQueue({
      name: 'audio-processing-queue',
    }),
  ],
  controllers: [SetsController],
  providers: [
    SetsService,
    SlugService,
    SetsGateway,
    AudioProcessingProcessor,
    AnalysisGateway,
  ],
})
export class SetsModule {}
