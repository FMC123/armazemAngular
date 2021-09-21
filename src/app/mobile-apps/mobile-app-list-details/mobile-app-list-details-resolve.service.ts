import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { MobileApp } from 'app/mobile-apps/mobile-app';
import { MobileAppService } from 'app/mobile-apps/mobile-app.service';
import { ErrorHandler } from 'app/shared/errors/error-handler';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MobileAppDetailsResolve implements Resolve<MobileApp> {
  constructor(private service: MobileAppService, private router: Router, private errorHandler: ErrorHandler) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      this.router.navigate(['/mobile-app']);
      return false;
    }
    let id = route.params['id'];
    return this.service.find(id).then(mobileApp => {
      if (mobileApp) {
        return mobileApp;
      } else {
        this.router.navigate(['/mobile-app']);
        return false;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
