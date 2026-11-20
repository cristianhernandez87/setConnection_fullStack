import { Injectable, OnDestroy, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface AnalysisProgressEvent {
  setId?: string;
  percent: number;
  currentStep?: string;
}

export interface TrackFoundEvent {
  setId?: string;
  track: {
    title: string;
    artist?: string;
    startTime?: number;
    timestamp?: number;
    status?: string;
    matchUrl?: string;
  };
}

export interface AnalysisCompletedEvent {
  setId?: string;
  totalTracks?: number;
}

@Injectable({
  providedIn: 'root',
})
export class SocketService implements OnDestroy {
  private readonly socket: Socket;
  readonly isConnected = signal<boolean>(false);

  constructor() {
    this.socket = io(environment.socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      this.isConnected.set(true);
    });

    this.socket.on('disconnect', () => {
      this.isConnected.set(false);
    });

    this.socket.on('connect_error', (err) => {
      this.isConnected.set(false);
      console.warn('Error de conexión en SocketService:', err.message);
    });
  }

  onAnalysisProgress(): Observable<AnalysisProgressEvent> {
    return new Observable<AnalysisProgressEvent>((observer) => {
      const handler = (data: AnalysisProgressEvent) => observer.next(data);
      this.socket.on('analysis:progress', handler);
      return () => this.socket.off('analysis:progress', handler);
    });
  }

  onTrackFound(): Observable<TrackFoundEvent> {
    return new Observable<TrackFoundEvent>((observer) => {
      const handler = (data: TrackFoundEvent) => observer.next(data);
      this.socket.on('track:found', handler);
      return () => this.socket.off('track:found', handler);
    });
  }

  onAnalysisCompleted(): Observable<AnalysisCompletedEvent> {
    return new Observable<AnalysisCompletedEvent>((observer) => {
      const handler = (data: AnalysisCompletedEvent) => observer.next(data);
      this.socket.on('analysis:completed', handler);
      return () => this.socket.off('analysis:completed', handler);
    });
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }
}