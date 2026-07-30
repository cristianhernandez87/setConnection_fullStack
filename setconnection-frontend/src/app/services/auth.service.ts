import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User, AuthResponse, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = 'http://localhost:3000/auth';

  currentUser = signal<User | null>(this.getStoredUser());
  isAuthModalOpen = signal<boolean>(false);
  modalMode = signal<'login' | 'register' | 'forgot-password'>('login');
  isAuthenticated = computed(() => this.currentUser() !== null);
  isDj = computed(() => this.currentUser()?.role === 'DJ');
  canInteract = computed(() => {
    const role = this.currentUser()?.role;
    return role === 'FAN' || role === 'DJ';
  });

  openModal(mode: 'login' | 'register' | 'forgot-password' = 'login'): void {
    this.modalMode.set(mode);
    this.isAuthModalOpen.set(true);
  }

  closeModal(): void {
    this.isAuthModalOpen.set(false);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  register(email: string, password: string, name: string, role: UserRole): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { email, password, name, role }).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password`, { token, newPassword });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    console.log('🔓 Sesión cerrada.');
    this.router.navigate(['/']);
  }

  private handleAuthSuccess(response: AuthResponse): void {
    if (!response || !response.user) return;

    const token = response.token || response.accessToken;
    if (token) {
      localStorage.setItem('token', token);
    }
    
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUser.set(response.user);
    this.closeModal();

    console.log(`🔐 Sesión iniciada con éxito: ${response.user.name} [Rol: ${response.user.role}]`);

    if (response.user.role === 'DJ') {
      this.router.navigate(['/studio']);
    }
  }

  private getStoredUser(): User | null {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}