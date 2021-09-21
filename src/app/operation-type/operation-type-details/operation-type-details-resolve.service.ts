import { OperationType } from './../operation-type';
import { OperationTypeService } from './../operation-type.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class OperationTypeDetailsResolve implements Resolve<OperationType> {
  constructor(private service: OperationTypeService, private router: Router, private errorHandler: ErrorHandler) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    let id = route.params['id'];

    return this.service.find(id).then(operationType => {
      if (operationType) {
        return operationType;
      } else {
        this.router.navigate(['/operation-type']);
        return false;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
