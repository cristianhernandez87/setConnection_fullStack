import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
// import { firstValueFrom } from 'rxjs';
import { SourceProvider } from './entities/track-source.entity';

@Injectable()
export class AggregatorService {
  private readonly logger = new Logger(AggregatorService.name);

  constructor(private readonly httpService: HttpService) {}

  async findTrackLinks(title: string, artist: string) {
    this.logger.log(`🔎 Buscando links para: ${title} - ${artist}`);
    const [spotify, beatport] = await Promise.all([
      this.searchSpotify(title, artist),
      this.searchBeatport(title, artist),
    ]);

    return [spotify, beatport].filter((link) => link !== null);
  }

  private async searchSpotify(title: string, artist: string) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const query = encodeURIComponent(`${title} ${artist}`);
    return {
      provider: SourceProvider.SPOTIFY,
      external_id: `sp-${Math.random().toString(36).substr(2, 9)}`,
      external_url: `https://open.spotify.com/search/${query}`,
    };
  }

  private async searchBeatport(title: string, artist: string) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const query = encodeURIComponent(`${title} ${artist}`);
    return {
      provider: SourceProvider.BEATPORT,
      external_id: `bp-${Math.random().toString(36).substr(2, 9)}`,
      external_url: `https://www.beatport.com/search?q=${query}`,
    };
  }
}
