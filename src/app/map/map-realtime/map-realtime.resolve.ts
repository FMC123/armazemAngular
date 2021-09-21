import { ErrorHandler } from '../../shared/errors/error-handler';
import { AuthService } from '../../auth/auth.service';
import { MapPositionStorageUnit } from '../map-position/map-position-storage-unit';
import { MapRealtimeServerService } from './map-realtime-server.service';
import { Injectable }             from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';

@Injectable()
export class MapRealtimeResolve implements Resolve<MapPositionStorageUnit> {
  constructor(
    private auth: AuthService,
    private service: MapRealtimeServerService,
    private router: Router,
    private errorHandler: ErrorHandler,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!this.auth.accessToken || !this.auth.accessToken.warehouse) {
      this.router.navigate(['/']);
      return false;
    }

    return this.service.listStorageUnitsByWarehouse(this.auth.accessToken.warehouse.id).then(storageUnits => {
      return storageUnits || [];
    }).catch(error => this.errorHandler.fromServer(error));
  }
}
