import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    AudioPlayerComponent, 
    NavbarComponent
  ],
  templateUrl: './app.component.html',
})
export class App {
  protected readonly title = signal('setconnection-frontend');
}
