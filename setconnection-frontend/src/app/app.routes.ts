import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UploadComponent } from './pages/upload/upload.component';
import { StudioComponent } from './pages/studio/studio.component';
import { SetDetailComponent } from './pages/set-detail/set-detail.component';
import { authGuard, djGuard } from './guards/auth.guard';  
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';  

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'upload', 
    component: UploadComponent,
    canActivate: [authGuard, djGuard]
  },
  { 
    path: 'studio', 
    component: StudioComponent,
    canActivate: [authGuard, djGuard]
  },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'set/:id', component: SetDetailComponent },
  { path: '**', redirectTo: '' }
];