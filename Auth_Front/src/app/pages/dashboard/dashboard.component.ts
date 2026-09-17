import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Navbar } from "../dashboard-rh/Shared/navbar/navbar";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  // Informations de l'utilisateur connecté
  userName: string = '';
  userRole: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Vérifie si l'utilisateur est connecté au chargement
    
  }

  onLogout() {
    // Appelle l'API logout puis supprime les tokens
    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearTokens();
        this.router.navigate(['/login']);
      },
      error: () => {
        // Même si erreur, on supprime les tokens localement
        this.authService.clearTokens();
        this.router.navigate(['/login']);
      }
    });
  }
}