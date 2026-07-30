import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }

  console.warn('🔒 Acceso denegado: Debes iniciar sesión.');
  router.navigate(['/']);
  authService.openModal('login');
  return false;
};

export const djGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isDj()) {
    return true;
  }

  console.warn('🎧 Acceso denegado: Esta zona es exclusiva para DJs.');
  router.navigate(['/']);
  return false;
};