import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  token = signal<string | null>(null);
  newPassword = '';
  confirmPassword = '';

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  isSuccess = signal<boolean>(false);

  ngOnInit(): void {
    // Capturar el token desde los Query Params (?token=...)
    const tokenFromUrl = this.route.snapshot.queryParamMap.get('token');
    if (!tokenFromUrl) {
      this.errorMessage.set('El enlace de recuperación es inválido o no contiene un token.');
    } else {
      this.token.set(tokenFromUrl);
    }
  }

  onSubmit(): void {
    if (!this.token()) {
      this.errorMessage.set('Token no encontrado.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden.');
      return;
    }

    const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    if (this.newPassword.length < 8 || !passwordRegex.test(this.newPassword)) {
      this.errorMessage.set('La contraseña debe contener al menos 8 caracteres, 1 mayúscula y 1 número o símbolo.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.resetPassword(this.token()!, this.newPassword).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSuccess.set(true);
      },
      error: (err: { error: { message: any; }; }) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'El token es inválido o ha expirado.');
      }
    });
  }

  openLoginModal(): void {
    this.router.navigate(['/']);
    // Abrir el modal de login
    this.authService.openModal('login');
  }
}