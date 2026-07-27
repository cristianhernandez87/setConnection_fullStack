import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss'
})
export class AuthModalComponent {
  authService = inject(AuthService);

  // Modo actual del modal: 'login' o 'register'
  mode = signal<'login' | 'register'>('login');
  
  // Rol seleccionado por defecto al registrarse
  selectedRole = signal<'FAN' | 'DJ'>('FAN');

  // Datos del formulario
  email = '';
  password = '';
  name = '';

  toggleMode(newMode: 'login' | 'register'): void {
    this.mode.set(newMode);
  }

  selectRole(role: 'FAN' | 'DJ'): void {
    this.selectedRole.set(role);
  }

  onSubmit(): void {
    if (!this.email || !this.password) return;

    if (this.mode() === 'login') {
      // Por defecto en la simulación de login entramos como DJ para probar, o según el correo
      const assignRole = this.email.includes('dj') ? 'DJ' : 'FAN';
      this.authService.login(this.email, assignRole);
    } else {
      // Registro real seleccionando el rol
      this.authService.login(this.email, this.selectedRole(), this.name);
    }
  }
}