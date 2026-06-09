import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http'; // <-- Agregamos HttpEventType

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {
  isDragging = false;
  selectedFile: File | null = null;
  
  setTitle = '';
  setDescription = '';
  isUploading = false;
  uploadSuccess = false;
  uploadProgress = 0; // <-- Nueva variable para el porcentaje

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  onDragOver(event: DragEvent) { /* ... mantenlo igual ... */ event.preventDefault(); this.isDragging = true; }
  onDragLeave(event: DragEvent) { /* ... mantenlo igual ... */ event.preventDefault(); this.isDragging = false; }
  onDrop(event: DragEvent) { /* ... mantenlo igual ... */ event.preventDefault(); this.isDragging = false; if (event.dataTransfer?.files.length) this.handleFile(event.dataTransfer.files[0]); }
  onFileSelected(event: any) { /* ... mantenlo igual ... */ if (event.target.files.length) this.handleFile(event.target.files[0]); }
  private handleFile(file: File) { this.selectedFile = file; this.uploadSuccess = false; this.uploadProgress = 0; }

  // 🔥 NUEVA Función de subida con progreso
  uploadSet() {
    if (!this.selectedFile || !this.setTitle) return;

    this.isUploading = true;
    this.uploadProgress = 0;
    
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('title', this.setTitle);
    formData.append('description', this.setDescription);

    // Activamos reportProgress y observe: 'events'
    this.http.post('http://localhost:3000/sets/upload', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event: any) => {
        // Calculamos el porcentaje mientras sube
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
          this.cdr.detectChanges();
        } 
        // Cuando termina y el backend responde
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