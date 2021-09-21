import { Injectable }       from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanLoad, Route,
  CanActivateChild
}                           from '@angular/router';
import { AuthService }      from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad, CanActivateChild {
  constructor(private auth: AuthService,
              private router: Router) {}

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.canActivate(route, state);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let url: string = state.url;
    return this.checkLogin(url);
  }

  canLoad(route: Route): Promise<boolean> {
    let url = `/${route.path}`;
    return this.checkLogin(url);
  }

  checkLogin(url: string): Promise<boolean> {
    if (this.auth.authenticated) {
      if (!this.auth.hasWarehouse) {
        return Promise.resolve(this.redirectToWarehouseLogin(url));
      }
      return Promise.resolve(true);
    }
    return new Promise<boolean>((resolve) => {
      this.auth.loginByToken().then(() => {
        if (!this.auth.hasWarehouse) {
          return resolve(this.redirectToWarehouseLogin(url));
        }
        return resolve(true);
      }).catch(() => {
        this.router.navigate(['/login']);
        resolve(false);
      });
    });
  }

  redirectToWarehouseLogin(url: string) {
    if (url.includes('/login/warehouse')) {
      return true;
    }
    this.router.navigate(['/login/warehouse']);
    return false;
  }
}
