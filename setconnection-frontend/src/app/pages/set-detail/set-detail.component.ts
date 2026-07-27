import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { WaveformComponent, TrackNode } from '../../components/waveform/waveform.component';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-set-detail',
  standalone: true,
  imports: [CommonModule, WaveformComponent],
  templateUrl: './set-detail.component.html',
  styleUrl: './set-detail.component.scss'
})
export class SetDetailComponent implements OnInit {
  audioService = inject(AudioService);
  private route = inject(ActivatedRoute);

  setId = signal<string>('1');

  setInfo = signal({
    title: 'Industrial Techno & Acid Peak Time Mix 2026',
    artist: 'DEX MUSIC',
    duration: '1:45:20',
    uploadDate: '24 JUL 2026',
    bpm: '148 - 155 BPM',
    description: 'Sesión grabada en vivo con hardware análogo y drum machines. Analizada al 100% por Inteligencia Artificial para el descubrimiento de tracks.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  });

  tracklist = signal<TrackNode[]>([
    { id: 't1', title: 'Universal Nation (Original Mix)', artist: 'Push', time: '00:00', percent: 0 },
    { id: 't2', title: 'Acperience 1', artist: 'Hardfloor', time: '14:20', percent: 18 },
    { id: 't3', title: 'The Bells', artist: 'Jeff Mills', time: '28:45', percent: 35 },
    { id: 't4', title: 'Crispy Bacon', artist: 'Laurent Garnier', time: '42:10', percent: 52 },
    { id: 't5', title: 'Spastik', artist: 'Plastikman', time: '58:30', percent: 70 },
    { id: 't6', title: 'Pulverturm', artist: 'Niels van Gogh', time: '1:15:00', percent: 85 }
  ]);

  ngOnInit(): void {
    // Capturamos el parámetro 'id' de la URL al cargar la vista
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.setId.set(id);
        console.log(`🧭 Cargando detalles para el Set ID: ${id}`);
        // Aquí posteriormente haremos una petición al backend para traer los datos reales del set ID
      }
    });
  }

  playThisSet(): void {
    const info = this.setInfo();
    this.audioService.loadAndPlay(info.audioUrl, `${info.artist} - ${info.title}`);
  }

  jumpToTrack(node: TrackNode): void {
    if (!this.audioService.isPlaying() || this.audioService.currentTrackTitle() !== `${this.setInfo().artist} - ${this.setInfo().title}`) {
      this.playThisSet();
    }
    setTimeout(() => {
      this.audioService.seekToPercent(node.percent);
    }, 100);
  }
}