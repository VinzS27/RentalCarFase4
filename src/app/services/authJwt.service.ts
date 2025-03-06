import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Token} from '../models/Token';
import {map} from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})

export class AuthJwtService {
  isUserLoggedIn: boolean = false;
  authURL: string = environment.authServerURI;

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<Token>(this.authURL, {username, password}).pipe(
      map(data => {
        this.isUserLoggedIn = true;
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(data.accessToken);
        sessionStorage.setItem('isUserLoggedIn', 'true');
        sessionStorage.setItem("token", data.accessToken);
        sessionStorage.setItem("id", decodedToken.id);
        sessionStorage.setItem("username", decodedToken.sub);
        sessionStorage.setItem("role", decodedToken.role);

        return data;
      })
    );
  }

  logout(): void {
    sessionStorage.clear();
    this.isUserLoggedIn = false;
  }

  getToken(): string {
    return sessionStorage.getItem("token") || "";
  }

  getRole(): string {
    return sessionStorage.getItem("role") || "";
  }

  getUsername(): string {
    return sessionStorage.getItem("username") || "";
  }

  getUserId(): string {
    return sessionStorage.getItem("id") || "";
  }

  isLogged(): boolean {
    return sessionStorage.getItem("isUserLoggedIn") === "true";
  }
}
