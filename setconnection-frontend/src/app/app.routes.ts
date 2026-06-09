import { Routes } from '@angular/router';
import { UploadComponent } from './pages/upload/upload.component';

export const routes: Routes = [
  { path: '', component: UploadComponent }, // Carga el upload por defecto
  { path: '**', redirectTo: '' }
];