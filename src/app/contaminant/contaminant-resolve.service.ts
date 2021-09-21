import {ContaminantService} from './contaminant.service';
import {Injectable} from '@angular/core';
import {Router, Resolve, ActivatedRouteSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Contaminant} from './contaminant';
import {ErrorHandler} from 'app/shared/errors/error-handler';

@Injectable()
export class ContaminantResolve implements Resolve<Contaminant> {
  constructor(private service: ContaminantService,
              private router: Router,
              private errorHandler: ErrorHandler) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      return Promise.resolve(new Contaminant());
    }
    let id = route.params['id'];
    return this.service.find(id).then(contaminant => {
      if (contaminant) {
        return contaminant;
      } else {
        this.router.navigate(['/contaminants']);
        return false;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
