import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CarService} from '../../../services/car.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CarDTO} from '../../../models/carDTO';

@Component({
  selector: 'app-add-car',
  imports: [ReactiveFormsModule],
  templateUrl: './add-car.component.html',
  standalone: true
})

export class AddCarComponent implements OnInit {
  registrationForm: FormGroup;
  carId: number | null = null;

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private carService = inject(CarService);
  private route = inject(ActivatedRoute);

  constructor() {
    this.registrationForm = this.fb.group({
      model: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      year: ['', [Validators.required]],
      licensePlate: ['', [Validators.required]],
      availability: ['', [Validators.required]]
    });
  }

    ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.carId = id ? Number(id) : null;
      if (this.carId) {
        this.loadCarById(this.carId);
      }
    });
  }

  loadCarById(carId: number) {
    this.carService.getCarById(carId).subscribe({
      next: (car) => {
        this.registrationForm.patchValue({
          model: car.model,
          brand: car.brand,
          year: car.year,
          licensePlate: car.licensePlate,
          availability: car.availability,
        });
      },
      error: (err) => console.error('Error loadById', err)
    });
  }

  save(): void {
    if (this.registrationForm.valid) {
      const formValue = this.registrationForm.value;

      const car: CarDTO = {
        id: this.carId ?? 0,
        brand: formValue.brand,
        model: formValue.model,
        year: formValue.year,
        licensePlate: formValue.licensePlate,
        availability: formValue.availability === 'true'
      };
      console.log(car);

      const carObservable = this.carId
        ? this.carService.updateCar(this.carId, car)
        : this.carService.addCar(car);

      carObservable.subscribe({
        next: () => {
          alert(this.carId ? 'Modifica completata' : 'Registrazione completata');
          this.router.navigate(['/cars']);
        },
        error: () => {
          alert(car ? 'Errore nella modifica.' : 'Errore nella registrazione.');
        }
      });
    }
  }
}
