import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { StorageModule } from '../storage/storage.module';
import { SetEntity } from './entities/set.entity';
import { TrackMarkerEntity } from './entities/track-marker.entity';
import { TrackSourceEntity } from './entities/track-source.entity';
import { SlugService } from '../../shared/services/slug.service';
import { SetsService } from './sets.service';
import { SetsController } from './sets.controller';
import { AudioProcessingProcessor } from './audio-processing.processor';
import { AnalysisGateway } from './analysis.gateway';
import { AudioMatchingService } from './audio-matching.service';
import { AggregatorService } from './aggregator.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([SetEntity, TrackMarkerEntity, TrackSourceEntity]),
    BullModule.registerQueue({ name: 'audio-processing-queue' }),
    StorageModule,
  ],
  controllers: [SetsController],
  providers: [
    SetsService,
    SlugService,
    AudioProcessingProcessor,
    AnalysisGateway,
    AudioMatchingService,
    AggregatorService,
  ],
  exports: [SetsService],
})
export class SetsModule {}