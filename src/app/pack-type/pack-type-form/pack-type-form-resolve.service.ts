import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';
import { PackTypeService } from './../pack-type.service';
import { PackType } from './../pack-type';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class PackTypeFormResolve implements Resolve<PackType> {
  constructor(private service: PackTypeService, private router: Router, private errorHandler: ErrorHandler) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      return Promise.resolve(PackType.fromData());
    }

    let id = route.params['id'];

    return this.service.find(id).then(packType => {
      if (packType) {
        return packType;
      } else {
        this.router.navigate(['/pack-type']);
        return false;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
