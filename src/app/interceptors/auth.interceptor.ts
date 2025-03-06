import {HttpEvent} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from "rxjs";
import {AuthJwtService} from "../services/authJwt.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private authService = inject(AuthJwtService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.authService.getToken();
    if (token != null) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }
    return next.handle(authReq)
  }
}
