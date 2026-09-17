import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { LoginRequest, LoginResponse } from '../../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    const request: LoginRequest = {
      email: this.email,
      password: this.password
    };

    this.authService.login(request).subscribe({
      next: (response: LoginResponse) => {
        this.authService.saveToken(response.token, response.refreshToken);
        localStorage.setItem('userEmail', response.email || this.email);
        localStorage.setItem('userName', this.email.split('@')[0]);
        localStorage.setItem('userRole', response.role || '');

        switch(response.role) {
          case 'RH':
            this.router.navigate(['/dashboard/rh']);
            break;
          case 'Technique':
            this.router.navigate(['/dashboard/technique']);
            break;
          case 'Candidat':
            this.router.navigate(['/dashboard/candidat']);
            break;
          default:
            this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.errorMessage = 'Email ou mot de passe invalide';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
