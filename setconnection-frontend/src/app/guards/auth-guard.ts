import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Validar si está logueado y es DJ
  if (authService.isAuthenticated() && authService.isDj()) {
    return true;
  }

  // 2. Si no tiene permisos, lo redirigimos (próximamente al /login, por ahora al home)
  console.warn('⛔ Acceso denegado: Se requiere rol de DJ para acceder a esta área.');
  router.navigate(['/']);
  return false;
};