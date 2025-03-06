import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {CarDTO} from '../models/carDTO';

@Injectable({
  providedIn: 'root'
})

export class CarService {

  carsUrl = environment.apiURI + '/admin/car'
  anyRoleUrl = environment.apiURI + '/any/car';

  private http = inject(HttpClient);

  getCars(): Observable<CarDTO[]> {
    return this.http.get<CarDTO[]>(this.anyRoleUrl);
  }

  getCarById(id: number) {
    const url = `${this.carsUrl}/${id}`;
    return this.http.get<CarDTO>(url);
  }

  addCar(car: CarDTO): Observable<CarDTO> {
    return this.http.post<CarDTO>(this.carsUrl, car);
  }

  deleteCar(id: number): Observable<unknown> {
    const url = `${this.carsUrl}/${id}`;
    return this.http.delete(url);
  }

  updateCar(id: number, car: CarDTO): Observable<CarDTO> {
    const url = `${this.carsUrl}/${id}`;
    return this.http.put<CarDTO>(url, car);
  }

}
