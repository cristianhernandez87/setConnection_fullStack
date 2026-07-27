import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component'; // <-- 1. Importa el modal
import { AuthService } from './services/auth.service'; // <-- 2. Importa el servicio

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    NavbarComponent, 
    AudioPlayerComponent, 
    AuthModalComponent // <-- 3. Agrégalo al arreglo de imports
  ],
  templateUrl: './app.component.html',
})
export class App {
  title = 'setconnection-frontend';
  authService = inject(AuthService);
}