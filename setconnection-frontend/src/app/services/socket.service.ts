import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs'; // <-- Asegúrate de que esto esté importado

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://127.0.0.1:3000'); 
  }

  onAnalysisProgress(): Observable<any> {
    return new Observable((observer) => { 
      this.socket.on('analysis:progress', (data) => observer.next(data));
    });
  }

  onTrackFound(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('track:found', (data) => observer.next(data));
    });
  }

  onAnalysisCompleted(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('analysis:completed', (data) => observer.next(data));
    });
  }
}