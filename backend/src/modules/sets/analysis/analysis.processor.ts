import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

interface AnalysisJobData {
  setId: string;
  filename: string;
}

@Processor('audio-analysis')
export class AnalysisProcessor extends WorkerHost {
  private readonly logger = new Logger(AnalysisProcessor.name);

  async process(job: Job<AnalysisJobData, any, string>): Promise<any> {
    this.logger.log(`Iniciando análisis del set: ${job.data.setId}`);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    this.logger.log(`¡Análisis completado para: ${job.data.setId}!`);
    return { success: true };
  }
}
