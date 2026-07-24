import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  // 🔥 Inyectamos el servicio global de audio
  audioService = inject(AudioService);

  // 🔥 Lista simulada de sets para el catálogo público (Próximamente vendrá del Backend en Sprint 10)
  recentSets = signal([
    {
      id: '1',
      title: 'Industrial Techno & Acid Peak Time Mix 2026',
      artist: 'Dex Music',
      duration: '1:45:20',
      tracksCount: 18,
      coverColor: 'bg-zinc-900 text-white',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
      id: '2',
      title: 'Dark Hypnotic Grooves - Berlin Warehouse Session',
      artist: 'DJ Zy',
      duration: '2:10:05',
      tracksCount: 24,
      coverColor: 'bg-bento-cyan text-black',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
    {
      id: '3',
      title: 'Raw Schranz & Fast BPM Destroyer Set',
      artist: 'Klangkuenstler Tribute',
      duration: '1:15:00',
      tracksCount: 14,
      coverColor: 'bg-bento-card text-zinc-900 border border-zinc-200',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    }
  ]);

  // Método rápido para reproducir desde las tarjetas
  playSet(set: any): void {
    console.log(`▶️ Reproduciendo desde Home: ${set.title}`);
    this.audioService.loadAndPlay(set.audioUrl, `${set.artist} - ${set.title}`);
  }
}