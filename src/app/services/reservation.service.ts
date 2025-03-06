import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {ReservationDTO} from '../models/reservationDTO';

@Injectable({
  providedIn: 'root'
})

export class ReservationService {

  reservationsUrl = environment.apiURI + '/admin/reservation'
  reservationsCustomerUrl = environment.apiURI + '/customer/reservation'
  anyRoleUrl = environment.apiURI + '/any/reservation';

  private http = inject(HttpClient);

  getReservations(): Observable<ReservationDTO[]> {
    return this.http.get<ReservationDTO[]>(this.reservationsUrl);
  }

  getReservationById(id: number) {
    const url = `${this.anyRoleUrl}/${id}`;
    return this.http.get<ReservationDTO>(url);
  }

  getAllReservationsByUserId(id: number): Observable<ReservationDTO[]> {
    const url = `${this.anyRoleUrl}/user/${id}`;
    return this.http.get<ReservationDTO[]>(url);
  }

  addReservation(reservation: ReservationDTO): Observable<ReservationDTO> {
    return this.http.post<ReservationDTO>(this.reservationsCustomerUrl, reservation);
  }

  deleteReservation(id: number): Observable<unknown> {
    const url = `${this.reservationsCustomerUrl}/${id}`;
    return this.http.delete(url);
  }

  updateReservation(id: number, reservation: ReservationDTO): Observable<ReservationDTO> {
    const url = `${this.reservationsCustomerUrl}/${id}`;
    return this.http.put<ReservationDTO>(url, reservation);
  }

  approveReservation(id: number): Observable<unknown> {
    const url = `${this.reservationsUrl}/approve/${id}`;
    return this.http.put(url,{});
  }

  declineReservation(id: number): Observable<unknown> {
    const url = `${this.reservationsUrl}/decline/${id}`;
    return this.http.put(url, {});
  }
}
