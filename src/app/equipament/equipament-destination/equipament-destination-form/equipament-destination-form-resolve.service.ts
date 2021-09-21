import { Injectable }             from '@angular/core';
import { Router, Resolve,
  ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';
import {EquipamentDestination} from "../equipament-destination";
import {EquipamentDestinationService} from "../equipament-destination.service";
import { EquipamentService } from '../../equipament.service';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class EquipamentDestinationFormResolve implements Resolve<EquipamentDestination> {
  constructor(
    private service: EquipamentDestinationService,
    private equipamentService: EquipamentService,
    private router: Router,
    private errorHandler: ErrorHandler
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    let id = route.params['id'];
    let equipamentId = route.parent.params['equipamentId'];

    return this.equipamentService.find(equipamentId).then(equipament => {

      if (!id) {
        let equipamentDestination = new EquipamentDestination();
        equipamentDestination.equipamentOrigin = equipament;

        return equipamentDestination;
      }

      return this.service.find(id).then(equipamentDestination => {
        if (equipamentDestination) {
          equipamentDestination.equipamentOrigin = equipament;
          return equipamentDestination;
        } else {
          this.router.navigate(['/equipament', equipamentId]);
          return false;
        }
      });

    }).catch((error) => this.errorHandler.fromServer(error));
  }

}
