import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';
import { EquipamentService } from './../equipament.service';
import { Equipament } from './../equipament';

@Injectable()
export class EquipamentFormResolve implements Resolve<Equipament> {
  constructor(private service: EquipamentService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      return Promise.resolve(Equipament.fromData({}));
    }

    let id = route.params['id'];

    return this.service.find(id).then(equipament => {
      if (equipament) {
        return equipament;
      } else {
        this.router.navigate(['/equipament']);
        return false;
      }
    });
  }
}
