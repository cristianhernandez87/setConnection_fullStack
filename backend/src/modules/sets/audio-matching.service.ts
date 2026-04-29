import { Injectable } from '@nestjs/common';

// Definimos la interfaz para que el contrato sea claro
export interface MatchResult {
  title: string;
  artist: string;
  startTime: number;
}

@Injectable()
export class AudioMatchingService {
  // Base de datos de "Huellas Digitales" simulada con tracks reales de Techno
  private readonly trackDatabase: MatchResult[] = [
    { title: 'Pulverturm', artist: 'Niels Van Gogh', startTime: 120 },
    { title: 'The Age of Love', artist: 'Age of Love', startTime: 300 },
    { title: 'Universal Nation', artist: 'Push', startTime: 600 },
    { title: 'Revenge', artist: 'Reinier Zonneveld', startTime: 900 },
    { title: 'Space Date', artist: 'Adam Beyer', startTime: 1200 },
  ];

  async matchAudio(
    setId: string,
    currentSecond: number,
  ): Promise<MatchResult | null> {
    // Simulamos un delay de procesamiento de "IA"
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Lógica: Si el segundo actual coincide con el startTime de nuestra DB, lo "encuentra"
    const match = this.trackDatabase.find(
      (t) => currentSecond >= t.startTime && currentSecond < t.startTime + 60,
    );

    return match || null;
  }
}
