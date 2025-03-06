import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthJwtService} from '../../../services/authJwt.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [RouterLink]
})

export class HeaderComponent implements OnInit {
  private authService = inject(AuthJwtService);
  private router = inject(Router);

  isUserLoggedIn = this.authService.isLogged();
  role = this.isUserLoggedIn ? this.authService.getRole() : null;

  ngOnInit(): void {
    this.checkUserStatus();
  }

  private checkUserStatus(): void {
    if (!this.isUserLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate([this.isAdmin() ? '/homepage' : '/homepage-customer']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.role?.includes('admin') || false;
  }
}
