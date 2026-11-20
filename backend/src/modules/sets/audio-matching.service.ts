import { Injectable } from '@nestjs/common';

export interface AudioMatchResult {
  title: string;
  artist: string;
  startTime: number;
}

@Injectable()
export class AudioMatchingService {
  /**
   * Busca coincidencia de audio para un set y un segundo dado.
   * Devuelve null cuando no hay un match real para evitar datos ficticios.
   */
  async matchAudio(
    _setId: string,
    _second: number,
  ): Promise<AudioMatchResult | null> {
    // Aquí irá la integración real con fingerprinting / búsqueda externa.
    // Mientras no exista coincidencia real, retornamos null.
    return null;
  }
}