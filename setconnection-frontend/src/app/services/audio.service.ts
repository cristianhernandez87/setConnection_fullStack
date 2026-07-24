import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio = new Audio();
  isPlaying = signal<boolean>(false);
  currentTime = signal<number>(0);
  duration = signal<number>(0);
  progress = signal<number>(0);
  currentTrackTitle = signal<string>('Selecciona un set para reproducir...');
  isLoading = signal<boolean>(false);

  constructor() {
    this.setupEvents();
  }

  private setupEvents(): void {
    
    this.audio.addEventListener('seeking', () => this.isLoading.set(true));
    this.audio.addEventListener('waiting', () => this.isLoading.set(true));
    this.audio.addEventListener('loadstart', () => this.isLoading.set(true));

    this.audio.addEventListener('seeked', () => this.isLoading.set(false));
    this.audio.addEventListener('canplay', () => this.isLoading.set(false));
    this.audio.addEventListener('playing', () => this.isLoading.set(false));

    this.audio.addEventListener('timeupdate', () => {
      const current = this.audio.currentTime;
      const total = this.audio.duration || 0;
      this.currentTime.set(current);
      if (total > 0) {
        this.progress.set((current / total) * 100);
      }
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.duration.set(this.audio.duration);
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying.set(false);
      this.progress.set(0);
    });
  }

  loadAndPlay(url: string, title: string): void {
    this.currentTrackTitle.set(title);
    this.audio.src = url;
    this.audio.load();
    this.play();
  }

  play(): void {
    this.audio.play();
    this.isPlaying.set(true);
  }

  pause(): void {
    this.audio.pause();
    this.isPlaying.set(false);
  }

  togglePlay(): void {
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  }

  seekToPercent(percent: number): void {
    const total = this.audio.duration;
    if (total > 0) {
      this.audio.currentTime = (percent / 100) * total;
    }
  }
}