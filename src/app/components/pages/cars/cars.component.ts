import {Component, inject, OnInit, signal} from '@angular/core';
import {CarDTO} from '../../../models/carDTO';
import {AuthJwtService} from '../../../services/authJwt.service';
import {Router} from '@angular/router';
import {CarService} from '../../../services/car.service';
import {MyButtonConfig, MyTableActionEnum, MyTableComponent, MyTableConfig} from 'my-lib';

@Component({
  selector: 'app-cars',
  imports: [MyTableComponent],
  templateUrl: './cars.component.html',
  standalone: true
})
export class CarsComponent implements OnInit {

  cars: CarDTO[] = []
  role: string | null = null;

  private router = inject(Router);

  constructor(private authService: AuthJwtService, private carService: CarService) {
    if (!this.authService.isLogged()) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.loadCars();
    this.role = this.authService.isLogged() ? this.authService.getRole() : null;
  }

  loadCars() {
    this.carService.getCars().subscribe({
      next: (data) => {
        this.cars = data.map(car => ({
          ...car,
          carInfo: `${car.brand} ${car.model} (${car.year})`
        }));
      },
      error: (err) => console.error('Errore nel caricamento auto:', err)
    });
  }

  myTableCustomerConfig = signal<MyTableConfig>({
    headers: [
      {key: 'brand', label: 'Brand'},
      {key: 'model', label: 'Modello'},
      {key: 'year', label: 'Anno'},
    ],
    order: {defaultColumn: 'brand', orderType: 'asc'},
    search: {columns: ['brand']},
    pagination: {itemPerPage: 5, itemPerPageOptions: [5, 10, 15]}
  })

  myTableConfig = signal<MyTableConfig>({
    headers: [
      {key: 'carInfo', label: 'Auto'},
      {key: 'licensePlate', label: 'Targa'},
    ],
    order: {defaultColumn: 'carInfo', orderType: 'asc'},
    search: {columns: ['brand','carInfo','licensePlate']},
    pagination: {itemPerPage: 5, itemPerPageOptions: [5, 10, 15]},
    actions: [
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

  handleTableAction(action: { action: MyTableActionEnum; row?: CarDTO }) {
    switch (action.action) {
      case MyTableActionEnum.EDIT:
        this.editCar(action.row);
        break;
      case MyTableActionEnum.DELETE:
        this.deleteCar(action.row);
        break;
      case MyTableActionEnum.NEW_ROW:
        this.addCar();
        break;
    }
  }

  addCar() {
    this.router.navigate(['/addCar']);
  }

  editCar(car?: CarDTO) {
    if (car) {
      this.router.navigate(['/addCar', car.id]);
    }
  }

  deleteCar(car?: CarDTO) {
    if (car && confirm(`Sei sicuro di voler eliminare ' ${car.brand} ${car.model}?`)) {
      this.carService.deleteCar(car.id).subscribe({
        next: () => {
          alert(`${car.brand} ${car.model} eliminata con successo!`);
          this.loadCars();
        },
        error: () => {
          alert('Errore durante l\'eliminazione dell\'auto.');
        }
      });
    }
  }

  isAdmin(): boolean {
    return this.role?.includes('admin') || false;
  }
}
