import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SocketService, TrackFoundEvent } from '../../services/socket.service';

export interface IdentifiedTrack {
  id?: string;
  title: string;
  artist?: string;
  status?: string;
  timestamp?: number;
}

@Component({
  selector: 'app-track-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './track-table.component.html',
  styleUrl: './track-table.component.scss',
})
export class TrackTableComponent implements OnInit, OnDestroy {
  private readonly socketService = inject(SocketService);
  private readonly sub = new Subscription();

  readonly tracks = signal<IdentifiedTrack[]>([]);

  ngOnInit(): void {
    this.sub.add(
      this.socketService.onTrackFound().subscribe((data: TrackFoundEvent | any) => {
        const incomingTrack = data?.track ?? data;
        if (!incomingTrack) return;

        const normalized: IdentifiedTrack =
          typeof incomingTrack === 'string'
            ? { title: incomingTrack, artist: 'Desconocido', status: 'MATCHED' }
            : {
                id: incomingTrack.id,
                title: incomingTrack.title ?? 'Track sin título',
                artist: incomingTrack.artist ?? 'Desconocido',
                status: incomingTrack.status ?? 'MATCHED',
                timestamp: incomingTrack.timestamp ?? incomingTrack.startTime,
              };

        this.tracks.update((currentTracks) => {
          const alreadyExists = currentTracks.some((item) => {
            if (normalized.id && item.id) {
              return item.id === normalized.id;
            }
            return (
              item.title.toLowerCase() === normalized.title.toLowerCase() &&
              (item.artist ?? '').toLowerCase() === (normalized.artist ?? '').toLowerCase() &&
              item.timestamp === normalized.timestamp
            );
          });

          if (alreadyExists) {
            return currentTracks;
          }

          const updated = [...currentTracks, normalized];
          return updated.sort((a, b) => (a.timestamp ?? Number.MAX_SAFE_INTEGER) - (b.timestamp ?? Number.MAX_SAFE_INTEGER));
        });
      }),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}