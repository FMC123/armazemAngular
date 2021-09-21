import { BalanceService } from './balance.service';
import { Injectable }       from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanLoad, Route,
  CanActivateChild
}                           from '@angular/router';

@Injectable()
export class BalanceHasScaleGuard implements CanActivate, CanLoad, CanActivateChild {
  constructor(
    private service: BalanceService,
    private router: Router
  ) {}

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this.checkLogin(url);
  }

  canLoad(route: Route): boolean {
    let url = `/${route.path}`;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (!this.service.scale) {
      this.router.navigate(['/balance']);
      return false;
    }

    return true;
  }

}
