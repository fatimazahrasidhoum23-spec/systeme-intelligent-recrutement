import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth';

@Component({
  selector: 'app-rh-sidebar',
  standalone: true,
  imports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './rh-sidebar.html'
})
export class RhSidebar {
  constructor(private authService: AuthService, private router: Router) {}

  onLogout() {
    this.authService.clearTokens();
    this.router.navigate(['/login']);
  }
}
