import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Resolve } from '@angular/router/src/interfaces';

import { Injectable } from '@angular/core';
import {MapZonePositionServerService} from "./map-zone-position-server.service";
import {AuthService} from "../../../auth/auth.service";
import {ErrorHandler} from "../../../shared/errors/error-handler";

@Injectable()
export class MapZonePositionResolve implements Resolve<Array<Position>> {

  constructor(private auth: AuthService,
              private errorHandler: ErrorHandler,
              private service: MapZonePositionServerService,
              private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    return this.service.listByWarehouse(this.auth.accessToken.warehouse.id).then(layers => {
      return layers;
    }).catch((error) => {
      this.errorHandler.fromServer(error);
      this.router.navigate(['/']);
      return false;
    });
  }

};
