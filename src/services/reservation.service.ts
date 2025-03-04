import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';
import {environment} from '../environments/environment';
import {ReservationDTO} from '../app/models/reservationDTO';
import {AuthJwtService} from './authJwt.service';
import {UserDTO} from '../app/models/userDTO';

@Injectable({
  providedIn: 'root'
})

export class ReservationService {

  reservationsUrl = environment.apiURI + '/admin/reservation'
  reservationsCustomerUrl = environment.apiURI + '/customer/reservation'
  anyRoleUrl = environment.apiURI + '/any/reservation';

  constructor(private http: HttpClient,  private authService: AuthJwtService) {}

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

  getReservations(): Observable<ReservationDTO[]> {
    return this.http.get<ReservationDTO[]>(this.reservationsUrl,this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );

  }

  getReservationById(id: number) {
    const url = `${this.anyRoleUrl}/${id}`;
    return this.http.get<ReservationDTO>(url,this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  getAllReservationsByUserId(id: number): Observable<ReservationDTO[]> {
    const url = `${this.anyRoleUrl}/user/${id}`;
    return this.http.get<ReservationDTO[]>(url, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  addReservation(reservation: ReservationDTO): Observable<ReservationDTO> {
    return this.http.post<ReservationDTO>(this.reservationsCustomerUrl, reservation, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  deleteReservation(id: number): Observable<unknown> {
    const url = `${this.reservationsCustomerUrl}/${id}`;
    return this.http.delete(url, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  updateReservation(id: number, reservation: ReservationDTO): Observable<ReservationDTO> {
    const url = `${this.reservationsCustomerUrl}/${id}`;
    return this.http.put<ReservationDTO>(url, reservation, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  approveReservation(id: number): Observable<unknown> {
    const url = `${this.reservationsUrl}/approve/${id}`;
    return this.http.put(url,{}, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  declineReservation(id: number): Observable<unknown> {
    const url = `${this.reservationsUrl}/decline/${id}`;
    return this.http.put(url, {}, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }
}
