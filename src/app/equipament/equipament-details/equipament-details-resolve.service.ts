import { Equipament } from '../equipament';
import { EquipamentService } from '../equipament.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class EquipamentDetailsResolve implements Resolve<Equipament> {
  constructor(private service: EquipamentService, private router: Router, private errorHandler: ErrorHandler) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    let id = route.params['id'];

    return this.service.find(id).then(equipament => {
      if (equipament) {
        return equipament;
      } else {
        this.router.navigate(['/equipament']);
        return false;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
