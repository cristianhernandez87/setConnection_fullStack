import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WaveformComponent } from '../../components/waveform/waveform.component';

@Component({
  selector: 'app-studio',
  standalone: true,
  imports: [CommonModule, RouterLink, WaveformComponent],
  templateUrl: './studio.component.html',
  styleUrl: './studio.component.scss'
})
export class StudioComponent {
  // 🔥 Datos del Artista
  artistName = signal<string>('DEX MUSIC');
  
  // 🔥 Stats para los bloques Bento de color
  stats = signal({
    totalPlays: '125.4K',
    tracksDiscovered: '6.7K',
    storageUsed: '82 GB',
    storageLimit: '250 GB'
  });

  // 🔥 Lista de sets subidos por el DJ (Con los estados que vimos en la maqueta)
  mySets = signal([
    {
      id: '1',
      title: 'Techno Industrial Test Set - Berlin Session',
      duration: '1:54:30',
      status: 'PUBLICADO', // PUBLICADO | PROCESANDO | ERROR
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      statusDot: 'bg-emerald-500',
      tracksCount: 15,
      progress: 35
    },
    {
      id: '2',
      title: 'Dark Hypnotic Warehouse Mix 004',
      duration: '2:05:10',
      status: 'PROCESANDO IA',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-300',
      statusDot: 'bg-amber-500 animate-pulse',
      tracksCount: 8,
      progress: 60
    },
    {
      id: '3',
      title: 'Raw Schranz 155 BPM Destroyer',
      duration: '1:12:00',
      status: 'PUBLICADO',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      statusDot: 'bg-emerald-500',
      tracksCount: 19,
      progress: 100
    }
  ]);
}