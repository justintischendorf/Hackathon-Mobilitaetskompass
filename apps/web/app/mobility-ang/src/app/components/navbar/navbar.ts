import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  readonly mobileMenuOpen = signal(false);

  readonly navLinks = [
    { path: '/auto', label: 'Auto' },
    { path: '/oepnv', label: 'ÖPNV' },
    { path: '/fahrrad', label: 'Fahrrad' },
    { path: '/e-scooter', label: 'E-Scooter' },
    { path: '/carsharing', label: 'Car Sharing' },
    { path: '/uber', label: 'Uber' },
  ];

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
