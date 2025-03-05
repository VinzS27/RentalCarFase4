import {Component, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MyButtonConfig, MyTableActionEnum, MyTableComponent, MyTableConfig} from 'my-lib';
import {AuthJwtService} from '../../../../services/authJwt.service';
import {UserService} from '../../../../services/user.service';
import {UserDTO} from '../../../models/userDTO';

@Component({
  selector: 'app-home',
  templateUrl: './homepage.component.html',
  standalone: true,
  imports: [MyTableComponent]
})

export class HomepageComponent {
  users: UserDTO[] = []

  private authService = inject(AuthJwtService);
  private router = inject(Router);
  private userService = inject(UserService);

  constructor() {
    if (!this.authService.isLogged()) {
      this.router.navigate(['/login']);
    } else {
      this.loadUsers();
    }
  }

  private loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      }
    });
  }

  myTableConfig = signal<MyTableConfig>({
    headers: [
      {key: 'id', label: 'ID'},
      {key: 'username', label: 'Username'},
      {key: 'email', label: 'E-mail'},
    ],
    order: {defaultColumn: 'id', orderType: 'asc'},
    search: {columns: ['username']},
    pagination: {itemPerPage: 5, itemPerPageOptions: [5, 10, 15]},
    actions: [
      {
        type: MyTableActionEnum.CONFIRM,
        buttonConfig: new MyButtonConfig('btn btn-new', 'Visualizza', 'fas fa-eye')
      },
      {
        type: MyTableActionEnum.EDIT,
        buttonConfig: new MyButtonConfig('btn btn-update', 'Modifica', 'fas fa-edit')
      },
      {
        type: MyTableActionEnum.DELETE,
        buttonConfig: new MyButtonConfig('btn btn-delete', 'Elimina', 'fas fa-trash')
      },
      {
        type: MyTableActionEnum.NEW_ROW,
        buttonConfig: new MyButtonConfig('btn btn-new', 'Nuovo', 'fas fa-plus')
      }
    ]
  });

  handleTableAction(action: { action: MyTableActionEnum; row?: UserDTO }) {
    switch (action.action) {
      case MyTableActionEnum.CONFIRM:
        this.viewUser(action.row);
        break;
      case MyTableActionEnum.EDIT:
        this.editUser(action.row);
        break;
      case MyTableActionEnum.DELETE:
        this.deleteUser(action.row);
        break;
      case MyTableActionEnum.NEW_ROW:
        this.addUser();
        break;
    }
  }

  addUser() {
    this.router.navigate(['/registration']);
  }

  viewUser(user?: UserDTO) {
    if (user) {
      this.router.navigate(['/reservations', user.id]);
    }
  }

  editUser(user?: UserDTO) {
    if (user) {
      this.router.navigate(['/registration', user.id]);
    }
  }

  deleteUser(user?: UserDTO) {
    if (user && confirm(`Sei sicuro di voler eliminare l'utente ${user.username}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          alert(`Utente ${user.username} eliminato con successo!`);
          this.loadUsers();
        },
        error: () => {
          alert('Errore durante l\'eliminazione dell\'utente.');
        }
      });
    }
  }
}
