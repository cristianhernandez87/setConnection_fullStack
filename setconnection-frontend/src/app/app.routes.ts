import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UploadComponent } from './pages/upload/upload.component';
import { StudioComponent } from './pages/studio/studio.component';
import { SetDetailComponent } from './pages/set-detail/set-detail.component';
import { authGuard } from './guards/auth-guard';  

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'upload', 
    component: UploadComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'studio', 
    component: StudioComponent,
    canActivate: [authGuard]
  },
  { path: 'set/:id', component: SetDetailComponent },
  { path: '**', redirectTo: '' }
];