import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-track-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './track-table.component.html',
  styleUrl: './track-table.component.scss'
})
export class TrackTableComponent implements OnInit {
  private socketService = inject(SocketService);
  
  // 🔥 Usamos Signals para reactividad extrema (Angular 17+)
  tracks = signal<any[]>([]);

  ngOnInit() {
    this.socketService.onTrackFound().subscribe((data: any) => {
      // Cuando llega un track nuevo, actualizamos el signal conservando los anteriores
      this.tracks.update(currentTracks => [...currentTracks, data.track]);
    });
  }
}