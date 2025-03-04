import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthJwtService} from './authJwt.service';

@Injectable({
  providedIn: 'root'
})

export class RouteGuardService implements CanActivate {

  constructor(private authService: AuthJwtService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {
    let url: string = state.url;

    return this.checkLogin(next, url);
  }

  checkLogin(route: ActivatedRouteSnapshot, url: any): true | UrlTree {
    if (this.authService.isLogged()) {
      const userRole = this.authService.getRole();
      if (route.data['role'] && route.data['role'].indexOf(userRole) === -1) {
        return this.router.parseUrl('/login');
      }
      return true;
    } else
      return this.router.parseUrl('/login');
  }
}

