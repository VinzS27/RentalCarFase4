import {Component, OnInit, signal} from '@angular/core';
import {AuthJwtService} from '../../../../services/authJwt.service';
import {Router} from '@angular/router';
import {ReservationService} from '../../../../services/reservation.service';
import {ReservationDTO} from '../../../models/reservationDTO';
import {MyButtonConfig, MyTableActionEnum, MyTableComponent, MyTableConfig} from 'my-lib';
import {map} from 'rxjs';

@Component({
  selector: 'app-reservations',
  imports: [MyTableComponent],
  templateUrl: './reservations.component.html',
  standalone: true
})

export class ReservationsComponent implements OnInit {

  reservations: ReservationDTO[] = []

  constructor(private authService: AuthJwtService, private router: Router,
              private reservationService: ReservationService) {
    if (!this.authService.isLogged()) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.reservationService.getReservations().pipe(
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
        type: MyTableActionEnum.CONFIRM,
        buttonConfig: new MyButtonConfig('btn btn-new', 'Approva', 'fas fa-check-circle')
      },
      {
        type: MyTableActionEnum.DELETE,
        buttonConfig: new MyButtonConfig('btn btn-delete', 'Declina', 'fas fa-times-circle')
      },
    ]
  });

  handleTableAction(action: { action: MyTableActionEnum; row?: ReservationDTO }) {
    switch (action.action) {
      case MyTableActionEnum.CONFIRM:
        this.approveReservation(action.row);
        break;
      case MyTableActionEnum.DELETE:
        this.declineReservation(action.row);
        break;
    }
  }

  approveReservation(reservation?: ReservationDTO) {
    if (reservation && confirm(`Approvare la prenotazione di ${reservation.userDTO?.username}?`)) {
      this.reservationService.approveReservation(reservation.id).subscribe({
        next: () => {
          alert(`prenotazione accettata`);
          this.loadReservations();
        },
        error: () => {alert('Errore durante approvazione.');}
      });
    }
  }

  declineReservation(reservation?: ReservationDTO) {
    if (reservation && confirm(`Declinare la prenotazione di ${reservation.userDTO?.username}?`)) {
      this.reservationService.declineReservation(reservation.id).subscribe({
        next: () => {
          alert(`prenotazione negata`);
          this.loadReservations();
        },
        error: () => {alert('Errore durante la declinazione.');}
      });
    }
  }
}
