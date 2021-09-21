import { EquipamentService } from '../../equipament.service';
import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';

import { EquipamentTagService } from './../equipament-tag.service';
import { EquipamentTag } from './../equipament-tag';

@Injectable()
export class EquipamentTagFormResolve implements Resolve<EquipamentTag> {
  constructor(
    private service: EquipamentTagService,
    private equipamentService: EquipamentService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    let id = route.params['id'];
    let equipamentId = route.parent.params['equipamentId'];

    if (!id) {
      let equipamentTag = new EquipamentTag();
      return this.equipamentService.find(equipamentId).then((equipament) => {
        equipamentTag.equipament = equipament;
        return equipamentTag;
      });
    }

    return this.service.find(equipamentId, id).then(equipamentTag => {
      if (equipamentTag) {
        return equipamentTag;
      } else {
        this.router.navigate(['/equipament', equipamentId]);
        return false;
      }
    });
  }
}
