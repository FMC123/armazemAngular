import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { access } from 'fs';
import { Observable } from 'rxjs/Observable';

import {WarehouseStakeholderService} from "../warehouse-stakeholder.service";
import {WarehouseStakeholder} from "../warehouse-stakeholder";
import { ErrorHandler } from './../../shared/errors/error-handler';
import {AuthService} from "../../auth/auth.service";
@Injectable()
export class WarehouseStakeholderFormResolve implements Resolve<Position> {
  loading: boolean;
  error: boolean;
  warehouseStakeholder: WarehouseStakeholder;

  constructor(private auth: AuthService,
    private service: WarehouseStakeholderService,
              private errorHandler: ErrorHandler,
              private router: Router,
              ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
        if (!route.params['id']) {
      return Promise.resolve(new WarehouseStakeholder());
    }
    let id = route.params['id'];
      return this.service.find(id).then(warehouseStakeholder => {
        if (warehouseStakeholder) {
          return warehouseStakeholder;
        } else {
          this.router.navigate(['/warehouse-stakeholder']);
          return false;
        }

    }).catch((error) => this.handleError(error));
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
