import { ScaleService } from '../scale.service';
import { Injectable } from '@angular/core';
import { Router, Resolve,    ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Scale } from '../scale';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class ScaleDetailsResolve implements Resolve<Scale> {
  constructor(private service: ScaleService, private router: Router, private errorHandler: ErrorHandler) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      this.router.navigate(['/scale']);
      return false;
    }
    let id = route.params['id'];
    return this.service.find(id).then(scale => {
      if (scale) {
        return scale;
      } else {
        this.router.navigate(['/scale']);
        return false;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
