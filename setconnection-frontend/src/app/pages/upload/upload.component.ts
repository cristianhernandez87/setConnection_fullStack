import { Component, inject, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { SocketService } from '../../services/socket.service';
import { AnalysisHeaderComponent } from '../../components/analysis-header/analysis-header.component';
import { TrackTableComponent } from '../../components/track-table/track-table.component';
import { WaveformComponent } from '../../components/waveform/waveform.component';
import { AudioService } from '../../components/audio-player/audio-player.component';

export const MAX_SET_FILE_SIZE_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AnalysisHeaderComponent,
    TrackTableComponent,
    WaveformComponent,
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
})
export class UploadComponent implements OnInit, OnDestroy {
  isDragging = false;
  selectedFile: File | null = null;

  setTitle = '';
  setDescription = '';
  isUploading = false;
  uploadSuccess = false;
  uploadProgress = 0;

  sizeWarning: string | null = null;
  errorMessage: string | null = null;

  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly socketService = inject(SocketService);
  readonly audioService = inject(AudioService);

  private readonly subs = new Subscription();

  ngOnInit(): void {
    this.subs.add(
      this.socketService.onAnalysisProgress().subscribe((data) => {
        console.log('📈 Progreso desde Socket:', data);
      }),
    );

    this.subs.add(
      this.socketService.onTrackFound().subscribe((data) => {
        console.log('🎯 ¡Track encontrado en tiempo real!:', data);
      }),
    );

    this.subs.add(
      this.socketService.onAnalysisCompleted().subscribe((data) => {
        console.log('✨ Análisis completado:', data);
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files.length) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFile(input.files[0]);
    }
  }

  private formatFileSize(bytes: number): string {
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb >= 1) {
      return `${gb.toFixed(2)} GB`;
    }
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  }

  private handleFile(file: File): void {
    this.uploadSuccess = false;
    this.errorMessage = null;
    this.uploadProgress = 0;

    if (file.size > MAX_SET_FILE_SIZE_BYTES) {
      this.selectedFile = null;
      this.sizeWarning = `El archivo "${file.name}" pesa ${this.formatFileSize(file.size)} y supera el límite máximo permitido de 2 GB.`;
      this.cdr.detectChanges();
      return;
    }

    this.sizeWarning = null;
    this.selectedFile = file;
    this.cdr.detectChanges();
  }

  uploadSet(): void {
    const trimmedTitle = this.setTitle.trim();
    if (!this.selectedFile || !trimmedTitle || this.isUploading || this.sizeWarning) {
      return;
    }

    this.isUploading = true;
    this.uploadSuccess = false;
    this.errorMessage = null;
    this.uploadProgress = 0;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('title', trimmedTitle);
    if (this.setDescription.trim()) {
      formData.append('description', this.setDescription.trim());
    }

    this.http
      .post(`${environment.apiUrl}/sets/upload`, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = event.total
              ? Math.round((100 * event.loaded) / event.total)
              : 0;
            this.cdr.detectChanges();
          } else if (event.type === HttpEventType.Response) {
            console.log('¡Set subido con éxito!', event.body);
            this.isUploading = false;
            this.uploadSuccess = true;
            this.selectedFile = null;
            this.setTitle = '';
            this.setDescription = '';
            this.cdr.detectChanges();
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al subir:', err);
          this.isUploading = false;
          this.uploadProgress = 0;

          const backendMessage = Array.isArray(err.error?.message)
            ? err.error.message.join(', ')
            : err.error?.message;

          this.errorMessage =
            backendMessage ||
            `Error (${err.status || 'red'}) al subir el set. Verifica el tamaño y el formato del archivo.`;
          this.cdr.detectChanges();
        },
      });
  }
}