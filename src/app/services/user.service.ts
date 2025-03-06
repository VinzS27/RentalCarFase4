import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {UserDTO} from '../models/userDTO';
import {UserProfileDTO} from '../models/userProfileDTO';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  usersUrl = environment.apiURI + '/admin/user';
  anyRoleUrl = environment.apiURI + '/any/user';

  private http = inject(HttpClient);

  getUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.usersUrl);
  }

  getUserById(id: number): Observable<UserDTO> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<UserDTO>(url);
  }

  getUserByUsername(username: string): Observable<UserDTO> {
    const url = `${this.anyRoleUrl}/username/${username}`;
    return this.http.get<UserDTO>(url);
  }

  getRoles(): Observable<UserProfileDTO[]> {
    return this.http.get<UserProfileDTO[]>(this.usersUrl +"/roles");
  }

  addUser(user: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.usersUrl, user);
  }

  deleteUser(id: number): Observable<unknown> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.delete(url);
  }

  updateUser(id: number, user: UserDTO): Observable<UserDTO> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.put<UserDTO>(url, user);
  }
}
