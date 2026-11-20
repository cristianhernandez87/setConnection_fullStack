import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';

export interface StudioSet {
  id: string;
  title: string;
  description?: string;
  fileName?: string;
  filename?: string;
  audioUrl?: string;
  status?: string;
  durationSec?: number;
  tracksCount?: number;
  createdAt?: string;
}

@Component({
  selector: 'app-studio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './studio.component.html',
})
export class StudioComponent implements OnInit {
  private readonly http = inject(HttpClient);

  readonly sets = signal<StudioSet[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  readonly artistName = signal<string>(this.resolveArtistName());

  readonly stats = computed(() => {
    const list = this.sets();
    const totalTracks = list.reduce((acc, item) => acc + (item.tracksCount ?? 0), 0);

    return {
      totalPlays: list.length,
      tracksDiscovered: totalTracks,
      storageUsed: `${list.length}`,
      storageLimit: 'DB / MinIO',
    };
  });

  ngOnInit(): void {
    this.loadSets();
  }

  loadSets(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.http.get<StudioSet[]>(`${environment.apiUrl}/sets`).subscribe({
      next: (data: StudioSet[]) => {
        this.sets.set(Array.isArray(data) ? data : []);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Error cargando sets desde el backend:', err);
        this.errorMessage.set('No se pudieron cargar los sets desde la base de datos.');
        this.isLoading.set(false);
      },
    });
  }

  private resolveArtistName(): string {
    try {
      const rawUser = localStorage.getItem('user');
      if (!rawUser) return 'DJ Studio';
      const parsed = JSON.parse(rawUser) as { name?: string; email?: string };
      return parsed.name || parsed.email || 'DJ Studio';
    } catch {
      return 'DJ Studio';
    }
  }
}