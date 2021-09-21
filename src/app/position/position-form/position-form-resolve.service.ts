import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';

import {PositionService} from "../position.service";
import {Position} from "../position";
import {PositionLayerService} from "../../position-layer/position-layer.service";
import { ErrorHandler } from './../../shared/errors/error-handler';
import {AuthService} from "../../auth/auth.service";
@Injectable()
export class PositionFormResolve implements Resolve<Position> {
  loading: boolean;
  error: boolean;

  constructor(private auth: AuthService,
    private service: PositionService,
              private positionLayerService: PositionLayerService,
              private errorHandler: ErrorHandler,
              private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    let positionLayerId = route.queryParams['positionLayerId'];
    let position = new Position();
    if (!route.params['id']) {
      return this.positionLayerService.find(positionLayerId).then(positionLayer =>{
        position.positionLayer = positionLayer;
        position.warehouse = positionLayer.warehouse;
       return position;
     }).catch((error) => this.handleCriticalError(error));
    }
    let id = route.params['id'];
    let positionLayer = route.queryParams['positionLayerId'];
      return this.service.find(this.auth.accessToken.warehouse.id,id).then(position => {
        if (position) {
            return position;
          } else {
            this.router.navigate(['/stack-list/'+positionLayer]);
            return false;
          }

    }).catch((error) => this.handleCriticalError(error));
  }

  private handleCriticalError(error) {
    this.handleError(error).catch(() => {
      this.router.navigate(['/error']);
    });
  }

  private handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
