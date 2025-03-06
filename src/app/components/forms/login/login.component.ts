import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AuthJwtService} from '../../../services/authJwt.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html'
})

export class LoginComponent {
  loginError: string = '';
  username!: string;
  password!: string;
  private router = inject(Router);
  private authService = inject(AuthJwtService);

  onLogin() {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/header']).then(() => {window.location.reload();});
      },
      error: () => {
        this.loginError = 'Login failed. Please check your credentials.';
      }
    });
  }
}
