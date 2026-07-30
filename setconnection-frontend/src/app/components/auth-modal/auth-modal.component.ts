import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';
import { ModalShellComponent } from '../shared/modal-shell/modal-shell.component';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalShellComponent],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss'
})
export class AuthModalComponent {
  authService = inject(AuthService);

  mode = signal<'login' | 'register' | 'forgot-password'>('login');
  selectedRole = signal<UserRole>('FAN');
  email = '';
  password = '';
  confirmPassword = '';
  name = '';

  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  toggleMode(newMode: 'login' | 'register' | 'forgot-password'): void {
    this.mode.set(newMode);
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  selectRole(role: UserRole): void {
    this.selectedRole.set(role);
  }

  onSubmit(): void {
    if (!this.email) return;
    if (this.mode() === 'forgot-password') {
      this.handleForgotPassword();
      return;
    }

    if (!this.password) return;
    if (this.mode() === 'register') {
      if (this.password !== this.confirmPassword) {
        this.errorMessage.set('Las contraseñas no coinciden.');
        return;
      }

      const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
      if (this.password.length < 8 || !passwordRegex.test(this.password)) {
        this.errorMessage.set('La contraseña debe tener mínimo 8 caracteres, 1 mayúscula y 1 número o símbolo.');
        return;
      }
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    if (this.mode() === 'login') {
      this.authService.login(this.email, this.password).subscribe({
        next: () => this.isLoading.set(false),
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message || 'Error al iniciar sesión.');
        }
      });
    } else {
      const finalName = this.name || this.email.split('@')[0];
      this.authService.register(this.email, this.password, finalName, this.selectedRole()).subscribe({
        next: () => this.isLoading.set(false),
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message || 'Error al registrar la cuenta.');
        }
      });
    }
  }

  private handleForgotPassword(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Si el correo existe, hemos enviado un enlace de recuperación.');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Error al conectar con el servidor.');
      }
    });
  }
}