import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'DJ' | 'FAN' | 'LISTENER';
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  currentUser = signal<User | null>(null);
  isAuthModalOpen = signal<boolean>(false);
  isAuthenticated = computed(() => this.currentUser() !== null);
  isDj = computed(() => this.currentUser()?.role === 'DJ');
  canInteract = computed(() => {
    const role = this.currentUser()?.role;
    return role === 'FAN' || role === 'DJ';
  });

  constructor(private router: Router) {}

  openModal(): void {
    this.isAuthModalOpen.set(true);
  }

  closeModal(): void {
    this.isAuthModalOpen.set(false);
  }

  // Simulación de Login/Registro conectado al estado
  login(email: string, role: 'DJ' | 'FAN', name?: string): void {
    const mockUser: User = {
      id: 'u-' + Math.floor(Math.random() * 1000),
      name: name ? name.toUpperCase() : email.split('@')[0].toUpperCase(),
      email: email,
      role: role
    };
    
    this.currentUser.set(mockUser);
    this.closeModal();
    console.log(`🔐 Sesión iniciada como: ${mockUser.name} [Rol: ${mockUser.role}]`);
    
    if (role === 'DJ') {
      this.router.navigate(['/studio']);
    }
  }

  logout(): void {
    this.currentUser.set(null);
    console.log('🔓 Sesión cerrada.');
    this.router.navigate(['/']);
  }
}