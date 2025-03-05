import {Component, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {AuthJwtService} from '../../../../services/authJwt.service';
import {UserService} from '../../../../services/user.service';
import {MyTableComponent, MyTableConfig} from 'my-lib';
import {UserDTO} from '../../../models/userDTO';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [MyTableComponent],
  standalone: true
})

export class ProfileComponent {
  user: UserDTO[] = [];
  role: string | null = null;
  private authService = inject(AuthJwtService);
  private router = inject(Router);
  private userService = inject(UserService);

  constructor() {
    if (!this.authService.isLogged()) {
      this.router.navigate(['/login']);
    }else{
      this.loadUser();
      this.role = this.authService.isLogged() ? this.authService.getRole() : null;
    }
  }

  loadUser() {
    this.userService.getUserByUsername(this.authService.getUsername()).subscribe({
      next: (data) => {
        this.user[0] = data;
      },
      error: (err) => {
        console.error('Error loading user profile', err);
      }
    });
  }

  myTableConfig = signal<MyTableConfig>({
    headers: [
      {key: 'username', label: 'Username'},
      {key: 'email', label: 'Email'},
    ]
  });
}

