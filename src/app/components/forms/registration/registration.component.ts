import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../services/user.service';
import {UserDTO} from '../../../models/userDTO';
import {UserProfileDTO} from '../../../models/userProfileDTO';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  standalone: true,
  imports: [ReactiveFormsModule]
})

export class RegistrationComponent {
  registrationForm: FormGroup;
  userId: number | null = null;
  roles: UserProfileDTO[] = [];

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
    this.initData();
  }

  private initData() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.userId = id ? Number(id) : null;
      if (this.userId) {
        this.loadUserById(this.userId);
      }
    });
    this.loadRoles();
  }

  private loadUserById(userId: number) {
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.registrationForm.patchValue({
          username: user.username,
          email: user.email,
          password: user.password,
          role: 'CUSTOMER'
        });
      },
      error: (err) => console.error('Error loadById', err)
    });
  }

  private loadRoles() {
    this.userService.getRoles().subscribe(data => {
      this.roles = data;
    });
  }

  save(): void {
    if (this.registrationForm.valid) {
      const formValue = this.registrationForm.value;
      const selectedRoleType = formValue.role;
      const selectedRole = this.roles.find(role => role.type === selectedRoleType);

      const user: UserDTO = {
        id: this.userId ?? 0,
        username: formValue.username,
        password: formValue.password,
        email: formValue.email,
        userProfiles: selectedRole ? [selectedRole] : [],
        reservations: []
      };
      console.log(user);

      const userObservable = this.userId
        ? this.userService.updateUser(this.userId, user)
        : this.userService.addUser(user);

      userObservable.subscribe({
        next: () => {
          alert(this.userId ? 'Modifica completata con successo!' : 'Registrazione completata con successo!');
          this.router.navigate(['/homepage']);
        },
        error: () => {
          alert(user ? 'Errore nella modifica.' : 'Errore nella registrazione.');
        }
      });
    }
  }
}
