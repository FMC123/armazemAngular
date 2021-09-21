import { ErrorHandler } from '../../shared/errors/error-handler';
import { MapZoneManagerService } from './map-zone-manager.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Resolve } from '@angular/router/src/interfaces';
import { Observable } from 'rxjs/Rx';


@Injectable()
export class MapZonesResolve implements Resolve<Array<Position>> {

  constructor(private errorHandler: ErrorHandler,
              private service: MapZoneManagerService,
              private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    return this.service.list().then(mapZones => {
      return mapZones;
    }).catch((error) => {
      this.errorHandler.fromServer(error);
      this.router.navigate(['/']);
      return false;
    });
  }

};
