import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';
import {environment} from '../environments/environment';
import {CarDTO} from '../app/models/carDTO';
import {AuthJwtService} from './authJwt.service';
import {UserDTO} from '../app/models/userDTO';


@Injectable({
  providedIn: 'root'
})

export class CarService {

  carsUrl = environment.apiURI + '/admin/car'
  anyRoleUrl = environment.apiURI + '/any/car';

  constructor(private http: HttpClient, private authService: AuthJwtService) {
  }

  private getHttpOptions() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  getCars(): Observable<CarDTO[]> {
    return this.http.get<CarDTO[]>(this.anyRoleUrl, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  getAvailableCars(): Observable<CarDTO[]> {
    const url = `${this.anyRoleUrl}/available`;
    return this.http.get<CarDTO[]>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  getCarById(id: number) {
    const url = `${this.carsUrl}/${id}`;
    return this.http.get<CarDTO>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  addCar(car: CarDTO): Observable<CarDTO> {
    return this.http.post<CarDTO>(this.carsUrl, car, this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteCar(id: number): Observable<unknown> {
    const url = `${this.carsUrl}/${id}`;
    return this.http.delete(url, this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

  updateCar(id: number, car: CarDTO): Observable<CarDTO> {
    const url = `${this.carsUrl}/${id}`;
    return this.http.put<CarDTO>(url, car, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }

}
