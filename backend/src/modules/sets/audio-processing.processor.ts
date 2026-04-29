import { Process, Processor } from '@nestjs/bull';
import bull from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SetEntity, SetStatus } from './entities/set.entity';
import {
  TrackMarkerEntity,
  MarkerStatus,
} from './entities/track-marker.entity';
// import { SetsGateway } from './sets.gateway';
import { AnalysisGateway } from './analysis.gateway';
import { AudioMatchingService } from './audio-matching.service';
import { AggregatorService } from './aggregator.service';

@Processor('audio-processing-queue')
export class AudioProcessingProcessor {
  constructor(
    @InjectRepository(SetEntity)
    private readonly setRepository: Repository<SetEntity>,
    @InjectRepository(TrackMarkerEntity)
    private readonly markerRepository: Repository<TrackMarkerEntity>,
    // private readonly setsGateway: SetsGateway,
    private readonly analysisGateway: AnalysisGateway,
    private readonly audioMatchingService: AudioMatchingService,
    private readonly aggregatorService: AggregatorService,
  ) {}

  @Process('analyze-audio')
  async handleAnalysis(job: bull.Job<{ setId: string }>): Promise<any> {
    const { setId } = job.data;
    const set = await this.setRepository.findOne({ where: { id: setId } });

    if (!set) {
      console.error(
        `[Worker] ERROR: Set ${setId} no encontrado en la base de datos`,
      );
      return;
    }

    set.status = SetStatus.PROCESSING;
    await this.setRepository.save(set);

    const totalSimulatedSeconds = 1200;

    for (let second = 0; second <= totalSimulatedSeconds; second += 300) {
      const progress = Math.round((second / totalSimulatedSeconds) * 100);
      this.analysisGateway.emitAnalysisProgress(setId, progress);
      console.log(`[Worker] 📈 Analizando segundo ${second}... (${progress}%)`);

      // 🧠 Llamamos a nuestra "IA"
      const match = await this.audioMatchingService.matchAudio(setId, second);

      if (match) {
        console.log(
          `[Worker] 🎯 ¡Match encontrado!: ${match.title} - ${match.artist}`,
        );
        const links = await this.aggregatorService.findTrackLinks(
          match.title,
          match.artist,
        );
        const marker = this.markerRepository.create({
          start_time: match.startTime,
          title: match.title,
          artist: match.artist,
          status: MarkerStatus.MATCHED,
          set: set,
          sources: links,
        });

        const savedMarker = await this.markerRepository.save(marker);
        this.analysisGateway.emitTrackFound(setId, savedMarker);
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    set.status = SetStatus.READY;
    await this.setRepository.save(set);

    //this.setsGateway.emitAnalysisCompleted(setId);
    this.analysisGateway.emitAnalysisCompleted(setId);
    console.log(`[Worker] ✨ Análisis completado para Set: ${set.id}`);

    return { success: true, setId };
  }
}
