import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';

@Component({
  selector: 'app-modal-shell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-shell.component.html',
  styleUrl: './modal-shell.component.scss'
})
export class ModalShellComponent {
  close = output<void>();
  size = input<ModalSize>('md');
  padding = input<boolean | string>(false);

  maxWidthClass = computed(() => {
    const sizeMap: Record<ModalSize, string> = {
      sm: 'max-w-sm x',
      md: 'max-w-md x',
      lg: 'max-w-lg x',
      xl: 'max-w-xl x',
      '2xl': 'max-w-2xl x',
      '3xl': 'max-w-3xl x',
      '4xl': 'max-w-4xl x',
      full: 'max-w-6xl x'
    };
    return sizeMap[this.size()] || 'max-w-md';
  });

  paddingClass = computed(() => {
    const p = this.padding();
    if (typeof p === 'boolean') {
      return p ? 'p-6 md:p-8' : 'p-0';
    }
    return p;
  });
}