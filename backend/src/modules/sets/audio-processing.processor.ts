import { Process, Processor } from '@nestjs/bull'; // Bull clásico
import bull from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SetEntity, SetStatus } from './entities/set.entity';
import {
  TrackMarkerEntity,
  MarkerStatus,
} from './entities/track-marker.entity';
import { SetsGateway } from './sets.gateway';
import { AnalysisGateway } from './analysis.gateway';
import { SourceProvider } from './entities/track-source.entity';

@Processor('audio-processing-queue')
export class AudioProcessingProcessor {
  constructor(
    @InjectRepository(SetEntity)
    private readonly setRepository: Repository<SetEntity>,
    @InjectRepository(TrackMarkerEntity)
    private readonly markerRepository: Repository<TrackMarkerEntity>,
    private readonly setsGateway: SetsGateway,
    private readonly analysisGateway: AnalysisGateway,
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

    console.log(`[Worker] 🚀 Iniciando análisis del Set: ${set.title}`);

    for (let progress = 10; progress <= 100; progress += 30) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      this.setsGateway.emitAnalysisProgress(setId, progress);
      console.log(`[Worker] 📈 Progreso: ${progress}%`);

      if (progress === 40) {
        const mockTrack = this.markerRepository.create({
          start_time: 120,
          title: 'Deep House Vibes',
          artist: 'Zy Artist',
          status: MarkerStatus.MATCHED,
          set: set,
          sources: [
            {
              provider: SourceProvider.SPOTIFY,
              external_url: 'https://open.spotify.com/track/example',
              external_id: 'spotify-123',
            },
          ],
        });

        const savedTrack = await this.markerRepository.save(mockTrack);
        // AC: Emitir evento track:found
        this.analysisGateway.emitTrackFound(setId, savedTrack);
        console.log(`[Worker] ✅ Track y Fuente guardados en DB`);
      }
    }

    set.status = SetStatus.READY;
    await this.setRepository.save(set);

    this.setsGateway.emitAnalysisCompleted(setId);
    console.log(`[Worker] ✨ Análisis completado para Set: ${set.id}`);

    return { success: true, setId };
  }
}
