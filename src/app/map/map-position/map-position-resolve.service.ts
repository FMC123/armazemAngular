import { AuthService } from '../../auth/auth.service';
import { MapPositionServerService } from './map-position-server.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Resolve } from '@angular/router/src/interfaces';
import { Position } from '../../position/position';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Injectable } from '@angular/core';

@Injectable()
export class MapPositionResolve implements Resolve<Array<Position>> {

  constructor(private auth: AuthService,
              private errorHandler: ErrorHandler,
              private service: MapPositionServerService,
              private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!this.auth.accessToken || !this.auth.accessToken.warehouse) {
      this.router.navigate(['/']);
      return false;
    }

    return this.service.listByWarehouse(this.auth.accessToken.warehouse.id).then(layers => {
      return layers;
    }).catch((error) => {
      this.errorHandler.fromServer(error);
      this.router.navigate(['/']);
      return false;
    });
  }

};
