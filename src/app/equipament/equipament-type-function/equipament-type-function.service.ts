import { Endpoints } from '../../endpoints';
import { EquipamentTypeFunction } from './equipament-type-function';
import { Http } from '@angular/http';
import { AuthService } from '../../auth/auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class EquipamentTypeFunctionService {

  constructor(
    private http: Http,
    private auth: AuthService,
  ) {}

  list(equipamentTypeId: string): Promise<Array<EquipamentTypeFunction>> {
    return this.http.get(Endpoints.equipamentTypeFunctionUrl(equipamentTypeId))
      .toPromise()
      .then(response => {
        return EquipamentTypeFunction.fromListData(response.json());
      });
  }

}
