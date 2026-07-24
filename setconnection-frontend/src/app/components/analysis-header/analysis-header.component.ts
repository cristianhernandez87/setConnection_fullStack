import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-analysis-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analysis-header.component.html',
  styleUrl: './analysis-header.component.scss'
})
export class AnalysisHeaderComponent implements OnInit {
  progress = signal(0);
  isAnalyzing = signal(false);
  private socketService = inject(SocketService);

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent): void {
    // Si está analizando y aún no llega al 100%
    if (this.isAnalyzing() && this.progress() < 100) {
      $event.preventDefault();
      // Los navegadores modernos requieren esta línea para mostrar su alerta nativa
      $event.returnValue = 'La IA sigue analizando tu set. ¿Seguro que quieres salir?'; 
    }
  }

  ngOnInit() {
    // Cuando el backend avisa que avanzó el porcentaje
    this.socketService.onAnalysisProgress().subscribe((data: any) => {
      this.isAnalyzing.set(true);
      this.progress.set(data.percent);
    });

    // Cuando el backend avisa que terminó
    this.socketService.onAnalysisCompleted().subscribe(() => {
      this.progress.set(100);
    });
  }
}