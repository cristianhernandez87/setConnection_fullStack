import { Component, ElementRef, viewChild, input, effect, afterNextRender, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-waveform',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './waveform.component.html',
  styleUrl: './waveform.component.scss'
})
export class WaveformComponent {
  canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('waveformCanvas');
  peaks = input<number[]>(this.generateDefaultPeaks(150)); // Picos simulados por defecto si no llegan datos
  progress = input<number>(0); // Porcentaje reproducido (0% a 100%)

  private audioService = inject(AudioService);
  
  constructor() {
    effect(() => {
      this.drawWaveform();
    });

    afterNextRender(() => {
      this.resizeCanvas();
      this.drawWaveform();
    });
  }

  onCanvasClick(event: MouseEvent): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;

    // Obtenemos las dimensiones reales del elemento en la pantalla
    const rect = canvas.getBoundingClientRect();
    // Calculamos los píxeles desde el borde izquierdo del canvas hasta donde hizo clic
    const clickX = event.clientX - rect.left;
    // Lo convertimos en porcentaje (de 0 a 100)
    const percentClicked = (clickX / rect.width) * 100;

    console.log(`🎯 Clic en onda: ${Math.round(percentClicked)}% -> Saltando audio...`);
    
    // Le ordenamos al reproductor global que salte a ese porcentaje
    this.audioService.seekToPercent(percentClicked);
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef().nativeElement;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
  }

  private drawWaveform(): void {
    const canvas = this.canvasRef().nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const data = this.peaks();
    const currentProgress = this.progress();

    ctx.clearRect(0, 0, width, height);

    if (!data || data.length === 0) return;

    const totalBars = data.length;
    const barWidth = Math.max(2, (width / totalBars) - 2); // Ancho de barra con espacio de separación
    const barGap = 2;
    const centerY = height / 2;

    data.forEach((peak, index) => {
      const x = index * (barWidth + barGap);
      const barHeight = Math.max(4, peak * (height - 10)); // Altura proporcional al pico (mínimo 4px)
      const y = centerY - (barHeight / 2); // Centrado verticalmente
      const barPercent = (index / totalBars) * 100;

      if (barPercent <= currentProgress) {
        ctx.fillStyle = '#00ffcc';
        ctx.shadowColor = 'rgba(0, 255, 204, 0.6)';
        ctx.shadowBlur = 8;
      } else {
        ctx.fillStyle = '#333333';
        ctx.shadowBlur = 0;
      }
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 2);
      ctx.fill();
    });
  }

  private generateDefaultPeaks(count: number): number[] {
    return Array.from({ length: count }, (_, i) => {
      const base = Math.sin(i / 3) * 0.4 + 0.5;
      const noise = Math.random() * 0.2;
      return Math.min(1, Math.max(0.1, base + noise));
    });
  }
}