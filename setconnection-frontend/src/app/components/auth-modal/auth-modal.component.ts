import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';
import { ModalShellComponent } from '../shared/modal-shell/modal-shell.component';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ModalShellComponent
  ],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss'
})
export class AuthModalComponent {
  authService = inject(AuthService);

  // Estado del modo actual del modal ('login' | 'register')
  mode = signal<'login' | 'register'>('login');
  
  // Rol seleccionado por defecto para el registro
  selectedRole = signal<UserRole>('FAN');

  // Campos del formulario
  email = '';
  password = '';
  name = '';

  // Estados reactivos de la interfaz (Alertas y Carga)
  errorMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  /**
   * Cambia la vista entre Login y Registro limpiando errores anteriores
   */
  toggleMode(newMode: 'login' | 'register'): void {
    this.mode.set(newMode);
    this.errorMessage.set(null);
  }

  /**
   * Actualiza el rol seleccionado en el formulario de registro
   */
  selectRole(role: UserRole): void {
    this.selectedRole.set(role);
  }

  /**
   * Envía las credenciales a la API de NestJS
   */
  onSubmit(): void {
    if (!this.email || !this.password) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    if (this.mode() === 'login') {
      this.authService.login(this.email, this.password).subscribe({
        next: () => {
          this.isLoading.set(false);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(
            err.error?.message || 'Error al iniciar sesión. Verifica tus credenciales.'
          );
        }
      });
    } else {
      const finalName = this.name || this.email.split('@')[0];
      this.authService.register(this.email, this.password, finalName, this.selectedRole()).subscribe({
        next: () => {
          this.isLoading.set(false);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(
            err.error?.message || 'Error al registrar la cuenta.'
          );
        }
      });
    }
  }
}