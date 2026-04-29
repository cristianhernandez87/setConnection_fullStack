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
import { AudioMatchingService } from './audio-matching.service';
import { HttpModule } from '@nestjs/axios/dist/http.module';
import { AggregatorService } from './aggregator.service';

@Module({
  imports: [
    HttpModule,
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
    AudioProcessingProcessor,
    AudioMatchingService,
    AggregatorService,
  ],
})
export class SetsModule {}
