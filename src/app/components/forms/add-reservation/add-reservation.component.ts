import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ReservationService} from '../../../services/reservation.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ReservationDTO} from '../../../models/reservationDTO';
import {CarDTO} from '../../../models/carDTO';
import {CarService} from '../../../services/car.service';
import {AuthJwtService} from '../../../services/authJwt.service';

@Component({
  selector: 'app-add-reservation',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-reservation.component.html',
})

export class AddReservationComponent implements OnInit {
  registrationForm: FormGroup;
  reservationId: number | null = null;
  cars: CarDTO[] = [];
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private carService = inject(CarService);
  private reservationService = inject(ReservationService);
  private route = inject(ActivatedRoute);

  constructor(private authService: AuthJwtService) {
    this.registrationForm = this.fb.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      carId: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.reservationId = id ? Number(id) : null;
      if (this.reservationId) {
        this.loadReservationById(this.reservationId);
      }
    });
    this.loadCars();
  }

  loadReservationById(reservationId: number) {
    this.reservationService.getReservationById(reservationId).subscribe({
      next: (reservation) => {
        this.registrationForm.patchValue({
          startDate: reservation.startDate,
          endDate: reservation.endDate,
          carId: reservation.carDTO.id,
        });
      },
      error: (err) => console.error('Errore nel caricamento della prenotazione:', err)
    });
  }

  loadCars() {
    this.carService.getCars().subscribe(data => {
      this.cars = data;
    });
  }

  save(): void {
    if (this.registrationForm.valid) {
      const formValue = this.registrationForm.value;

      const selectedCar = this.cars.find(car => car.id === Number(formValue.carId));
      if (!selectedCar) {
        alert('Auto non trovata');
        return;
      }

      const reservation: ReservationDTO = {
        id: this.reservationId ?? 0,
        startDate: formValue.startDate,
        endDate: formValue.endDate,
        status: "in approvazione",
        carDTO: selectedCar,
        userDTO: {
          id: parseInt(this.authService.getUserId()),
          username: '',
          password: '',
          email: '',
          userProfiles: [],
          reservations: []
        }
      };

      const reservationObservable = this.reservationId
        ? this.reservationService.updateReservation(this.reservationId, reservation)
        : this.reservationService.addReservation(reservation);

      reservationObservable.subscribe({
        next: () => {
          alert(this.reservationId ? 'Modifica completata con successo!' : 'Registrazione completata con successo!');
          this.router.navigate(['/homepage-customer']);
        },
        error: () => {
          alert('Errore nella registrazione o modifica.');
        }
      });
    }
  }
}

