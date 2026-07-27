import { Component, ElementRef, viewChild, input, effect, afterNextRender, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../services/audio.service';
export interface TrackNode {
  id: string;
  title: string;
  artist: string;
  time: string;
  percent: number;
}
@Component({
  selector: 'app-waveform',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './waveform.component.html',
  styleUrl: './waveform.component.scss'
})
export class WaveformComponent {
  canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('waveformCanvas');
  peaks = input<number[]>(this.generateDefaultPeaks(150)); 
  progress = input<number>(0); 
  nodes = input<TrackNode[]>([]);
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
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentClicked = (clickX / rect.width) * 100;

    console.log(`🎯 Clic en onda: ${Math.round(percentClicked)}% -> Saltando audio...`);
    
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
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const data = this.peaks();
    const currentProgress = this.progress();
    const currentNodes = this.nodes();

    ctx.clearRect(0, 0, width, height);
    if (!data || data.length === 0) return;

    const totalBars = data.length;
    const barWidth = Math.max(2, (width / totalBars) - 2);
    const barGap = 2;
    const centerY = height / 2;

    // 1. DIBUJAR BARRAS DE ONDA
    data.forEach((peak, index) => {
      const x = index * (barWidth + barGap);
      const barHeight = Math.max(4, peak * (height - 20));
      const y = centerY - (barHeight / 2);
      const barPercent = (index / totalBars) * 100;

      if (barPercent <= currentProgress) {
        ctx.fillStyle = '#00ffcc'; // Neón
        ctx.shadowColor = 'rgba(0, 255, 204, 0.6)';
        ctx.shadowBlur = 8;
      } else {
        ctx.fillStyle = '#e4e4e7'; // Gris Apple minimalista claro para el fondo
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 2);
      ctx.fill();
    });

    // 2. 🔥 DIBUJAR NODOS (SMART TRACKLIST MARKERS)
    if (currentNodes && currentNodes.length > 0) {
      currentNodes.forEach(node => {
        const nodeX = (node.percent / 100) * width;
        
        // Línea vertical amarilla o negra
        ctx.beginPath();
        ctx.moveTo(nodeX, 0);
        ctx.lineTo(nodeX, height);
        ctx.strokeStyle = node.percent <= currentProgress ? '#CCFF00' : '#18181b'; // Amarillo Bento o Negro
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 2]); // Línea punteada editorial
        ctx.stroke();
        ctx.setLineDash([]); // Resetear dash

        // Punto superior (Nodo clicléable visualmente)
        ctx.beginPath();
        ctx.arc(nodeX, 12, 6, 0, Math.PI * 2);
        ctx.fillStyle = node.percent <= currentProgress ? '#00ffcc' : '#CCFF00';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
      });
    }
  }

  private generateDefaultPeaks(count: number): number[] {
    const peaks: number[] = [];
    
    for (let i = 0; i < count; i++) {
      // 1. Posición relativa en el timeline (de 0.0 a 1.0)
      const section = i / count;
      
      // 2. Superposición de ondas para romper la repetición geométrica
      // - La onda lenta (Math.sin * 6) crea zonas generales de mayor o menor volumen.
      // - La onda rápida (Math.cos * 15) genera micro-variaciones entre compases.
      const slowWave = Math.sin(section * Math.PI * 6) * 0.3;
      const fastWave = Math.cos(section * Math.PI * 15) * 0.15;
      
      // 3. Ruido controlado para el aspecto orgánico
      const randomNoise = Math.random() * 0.5;
      
      // Combinamos las capas
      let height = Math.abs(slowWave + fastWave) + randomNoise;
      
      // 4. Acotamos el resultado entre 0.15 (mínimo visible) y 1.0 (altura máxima del lienzo)
      height = Math.max(0.15, Math.min(1.0, height));
      
      peaks.push(height);
    }
    
    return peaks;
  }
}