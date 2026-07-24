import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http'; // <-- Agregamos HttpEventType
import { SocketService } from '../../services/socket.service';
import { AnalysisHeaderComponent } from "../../components/analysis-header/analysis-header.component";
import { TrackTableComponent } from "../../components/track-table/track-table.component";
import { WaveformComponent } from "../../components/waveform/waveform.component";
import { AudioService } from "../../components/audio-player/audio-player.component";

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    AnalysisHeaderComponent, 
    TrackTableComponent, 
    WaveformComponent
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent implements OnInit {
  isDragging = false;
  selectedFile: File | null = null;
  
  setTitle = '';
  setDescription = '';
  isUploading = false;
  uploadSuccess = false;
  uploadProgress = 0;

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private socketService = inject(SocketService);

  audioService = inject(AudioService);

  ngOnInit() {
    this.socketService.onAnalysisProgress().subscribe((data) => {
      console.log('📈 Progreso desde Socket:', data);
    });

    this.socketService.onTrackFound().subscribe((data) => {
      console.log('🎯 ¡Track encontrado en tiempo real!:', data);
    });

    this.socketService.onAnalysisCompleted().subscribe((data) => {
      console.log('✨ Análisis completado:', data);
    });
  }

  onDragOver(event: DragEvent) { event.preventDefault(); this.isDragging = true; }
  onDragLeave(event: DragEvent) { event.preventDefault(); this.isDragging = false; }
  onDrop(event: DragEvent) { event.preventDefault(); this.isDragging = false; if (event.dataTransfer?.files.length) this.handleFile(event.dataTransfer.files[0]); }
  onFileSelected(event: any) { if (event.target.files.length) this.handleFile(event.target.files[0]); }
  private handleFile(file: File) { this.selectedFile = file; this.uploadSuccess = false; this.uploadProgress = 0; }

  uploadSet() {
    if (!this.selectedFile || !this.setTitle) return;

    this.isUploading = true;
    this.uploadProgress = 0;
    
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('title', this.setTitle);
    formData.append('description', this.setDescription);

    this.http.post('http://127.0.0.1:3000/sets/upload', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
          this.cdr.detectChanges();
        } 
        else if (event.type === HttpEventType.Response) {
          console.log('¡Set subido con éxito!', event.body);
          this.isUploading = false;
          this.uploadSuccess = true;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error al subir', err);
        this.isUploading = false;
        this.uploadProgress = 0;
        alert('Hubo un error de conexión con el servidor.');
      }
    });
  }
}