import { MapHistoryServerService } from './map-history-server.service';
import { AuthService } from '../../auth/auth.service';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { MapHistory } from './map-history';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MapHistoryResolve implements Resolve<MapHistory> {

  constructor(private auth: AuthService,
              private errorHandler: ErrorHandler,
              private service: MapHistoryServerService,
              private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!this.auth.accessToken || !this.auth.accessToken.warehouse) {
      this.router.navigate(['/']);
      return false;
    }

    return this.service.find(this.auth.accessToken.warehouse.id, +new Date()).then(history => {
      return history;
    }).catch((error) => {
      this.errorHandler.fromServer(error);
      this.router.navigate(['/']);
      return false;
    });
  }

};
