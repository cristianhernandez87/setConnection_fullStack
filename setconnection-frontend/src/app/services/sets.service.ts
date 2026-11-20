
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface TrackSourceDetail {
  id: string;
  provider: 'SPOTIFY' | 'YOUTUBE' | 'SOUNDCLOUD' | 'BEATPORT' | 'BANDCAMP' | 'LOCAL' | string;
  externalUrl?: string;
  localClipUrl?: string;
}

export interface TrackMarkerDetail {
  id: string;
  start_time: number;
  title: string;
  artist?: string;
  status?: string;
  confidence_score?: number;
  sources?: TrackSourceDetail[];
}

export interface SetDetailResponse {
  id: string;
  title: string;
  description?: string;
  filename?: string;
  audioUrl?: string;
  status: string;
  createdAt?: string;
  markers?: TrackMarkerDetail[];
}

@Injectable({
  providedIn: 'root',
})
export class SetsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl || 'http://localhost:3000';

  getSetTracklist(setId: string): Observable<SetDetailResponse> {
    return this.http.get<SetDetailResponse>(`${this.apiUrl}/sets/${setId}/tracklist`);
  }

  getSets(): Observable<SetDetailResponse[]> {
    return this.http.get<SetDetailResponse[]>(`${this.apiUrl}/sets`);
  }
}