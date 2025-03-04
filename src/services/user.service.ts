import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthJwtService} from './authJwt.service';
import {environment} from '../environments/environment';
import {UserDTO} from '../app/models/userDTO';
import {UserProfileDTO} from '../app/models/userProfileDTO';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  usersUrl = environment.apiURI + '/admin/user';
  anyRoleUrl = environment.apiURI + '/any/user';

  constructor(private http: HttpClient, private authService: AuthJwtService) {
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

  private getHttpOptions() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  getUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.usersUrl, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  getUserById(id: number): Observable<UserDTO> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<UserDTO>(url, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  getUserByUsername(username: string): Observable<UserDTO> {
    const url = `${this.anyRoleUrl}/username/${username}`;
    return this.http.get<UserDTO>(url, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  getRoles(): Observable<UserProfileDTO[]> {
    return this.http.get<UserProfileDTO[]>(this.usersUrl +"/roles", this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  addUser(user: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.usersUrl, user, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: number): Observable<unknown> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.delete(url, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(id: number, user: UserDTO): Observable<UserDTO> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.put<UserDTO>(url, user, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }


}
