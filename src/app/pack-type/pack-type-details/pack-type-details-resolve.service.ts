import { PackType } from './../pack-type';
import { PackTypeService } from './../pack-type.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class PackTypeDetailsResolve implements Resolve<PackType> {
  constructor(private service: PackTypeService, private router: Router, private errorHandler: ErrorHandler) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
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
