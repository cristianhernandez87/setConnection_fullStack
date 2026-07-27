import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  authService = inject(AuthService);

  isMenuOpen = signal<boolean>(false);
  toggleMenu(): void {
    this.isMenuOpen.update(val => !val);
  }

  logout(): void {
    this.isMenuOpen.set(false);
    this.authService.logout();
  }
}