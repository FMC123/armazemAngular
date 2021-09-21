import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ErrorHandler } from 'app/shared/errors/error-handler';
import { ServiceInstruction } from '../service-instruction';
import { ServiceInstructionService } from '../service-instruction.service';

@Injectable()
export class ServiceInstructionFormResolve
  implements Resolve<ServiceInstruction> {
  constructor(
    private service: ServiceInstructionService,
    private router: Router,
    private errorHandler: ErrorHandler
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      return Promise.resolve(new ServiceInstruction());
    }
    let id = route.params['id'];
    return this.service.find(id).then(serviceInstruction => {
      if (serviceInstruction) {
        return serviceInstruction;
      } else {
        this.router.navigate(['/service-instruction']);
        return false;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
