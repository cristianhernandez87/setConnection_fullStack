import { Component, HostListener, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SocketService } from '../../services/socket.service';

interface AnalysisProgressPayload {
  percent?: number;
  setId?: string;
  step?: string;
}

@Component({
  selector: 'app-analysis-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analysis-header.component.html',
  styleUrl: './analysis-header.component.scss',
})
export class AnalysisHeaderComponent implements OnInit, OnDestroy {
  readonly progress = signal<number>(0);
  readonly isAnalyzing = signal<boolean>(false);

  private readonly socketService = inject(SocketService);
  private readonly subs = new Subscription();

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent): void {
    if (this.isAnalyzing() && this.progress() < 100) {
      $event.preventDefault();
      $event.returnValue = 'La IA sigue analizando tu set. ¿Seguro que quieres salir?';
    }
  }

  ngOnInit(): void {
    this.subs.add(
      this.socketService.onAnalysisProgress().subscribe((data: AnalysisProgressPayload) => {
        this.isAnalyzing.set(true);
        if (typeof data?.percent === 'number' && !Number.isNaN(data.percent)) {
          const clamped = Math.max(0, Math.min(100, data.percent));
          this.progress.set(clamped);
        }
      }),
    );

    this.subs.add(
      this.socketService.onAnalysisCompleted().subscribe(() => {
        this.progress.set(100);
        this.isAnalyzing.set(false);
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}