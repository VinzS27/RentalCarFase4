import {Component, inject, signal} from '@angular/core';
import {AuthJwtService} from '../../../../services/authJwt.service';
import {Router} from '@angular/router';
import {MyButtonConfig, MyTableActionEnum, MyTableComponent, MyTableConfig} from 'my-lib';
import {ReservationDTO} from '../../../models/reservationDTO';
import {ReservationService} from '../../../../services/reservation.service';
import {map} from 'rxjs';

@Component({
  selector: 'app-homepage-customer',
  imports: [MyTableComponent],
  templateUrl: './homepage-customer.component.html',
  standalone: true
})

export class HomepageCustomerComponent {
  reservations: ReservationDTO[] = []
  private authService = inject(AuthJwtService);
  private router = inject(Router);
  private reservationService = inject(ReservationService);

  constructor() {
    if (!this.authService.isLogged()) {
      this.router.navigate(['/login']);
    }else{
      this.loadReservationsById();
    }
  }

  loadReservationsById() {
    this.reservationService.getAllReservationsByUserId(parseInt(this.authService.getUserId())).pipe(
      map((reservations: ReservationDTO[]) =>
        reservations.map(res => ({
          ...res,
          user: res.userDTO?.username,
          car: `${res.carDTO?.model} ${res.carDTO?.brand} ${res.carDTO?.licensePlate}`
        }))
      )
    ).subscribe({
      next: (data) => {
        this.reservations = data;
      }, error: (err) => console.error("Errore loadReservations:", err)
    });
  }

  myTableConfig = signal<MyTableConfig>({
    headers: [
      {key: 'user', label: 'Utente'},
      {key: 'car', label: 'Auto'},
      {key: 'startDate', label: 'Data Inizio'},
      {key: 'endDate', label: 'Data Fine'},
      {key: 'status', label: 'Stato'}
    ],
    order: {defaultColumn: 'startDate', orderType: 'asc'},
    search: {columns: ['startDate', 'status']},
    pagination: {itemPerPage: 5, itemPerPageOptions: [5,10,15]},
    actions: [
      {
        type: MyTableActionEnum.NEW_ROW,
        buttonConfig: new MyButtonConfig('btn btn-new', 'Nuovo', 'fas fa-plus')
      },
      {
        type: MyTableActionEnum.EDIT,
        buttonConfig: new MyButtonConfig('btn btn-update', 'Modifica', 'fas fa-check-circle')
      },
      {
        type: MyTableActionEnum.DELETE,
        buttonConfig: new MyButtonConfig('btn btn-delete', 'Elimina', 'fas fa-times-circle')
      }
    ]
  });

  handleTableAction(action: { action: MyTableActionEnum; row?: ReservationDTO }) {
    switch (action.action) {
      case MyTableActionEnum.NEW_ROW:
        this.createReservation();
        break;
      case MyTableActionEnum.EDIT:
        this.editReservation(action.row);
        break;
      case MyTableActionEnum.DELETE:
        this.deleteReservation(action.row);
        break;
    }
  }

  createReservation() {
    this.router.navigate(['/addReservation']);
  }

  editReservation(reservation?: ReservationDTO) {
    if (reservation) {
      this.router.navigate(['/addReservation', reservation.id]);
    }
  }

  deleteReservation(reservation?: ReservationDTO) {
    if (reservation && confirm(`Eliminare la prenotazione?`)) {
      this.reservationService.deleteReservation(reservation.id).subscribe({
        next: () => {
          alert(`Prenotazione eliminata con successo!`);
          this.loadReservationsById();
        },
        error: () => {
          alert('Errore durante l\'eliminazione.');
        }
      });
    }
  }
}
