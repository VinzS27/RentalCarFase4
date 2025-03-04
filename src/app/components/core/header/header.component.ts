import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthJwtService} from '../../../../services/authJwt.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [RouterLink]
})

export class HeaderComponent implements OnInit {
  isUserLoggedIn: boolean = false;
  role: string | null = null;
  //vedere inject da tutorial Angular 19
  constructor(private authService: AuthJwtService, private router: Router) {
  }

  ngOnInit(): void {
    this.checkUserStatus();
  }

  checkUserStatus(): void {
    this.isUserLoggedIn = this.authService.isLogged();
    if (!this.isUserLoggedIn)
      this.router.navigate(['/login'])
    this.role = this.authService.isLogged() ? this.authService.getRole() : null;
    if (this.isAdmin())
      this.router.navigate(['/homepage'])
    else
      this.router.navigate(['/homepage-customer'])
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']).then(() => window.location.reload());
  }

  isAdmin(): boolean {
    return this.role?.includes('ROLE_ADMIN') || false;
  }
}
