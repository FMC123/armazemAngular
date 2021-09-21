import { EquipamentType } from './equipament-type';
import { Http } from '@angular/http';
import { AuthService } from '../../auth/auth.service';
import { Endpoints } from '../../endpoints';
import { Injectable } from '@angular/core';

@Injectable()
export class EquipamentTypeService {

  constructor(
    private http: Http,
    private auth: AuthService,
  ) {}

  list(): Promise<Array<EquipamentType>> {
    return this.http.get(Endpoints.equipamentTypeUrl)
      .toPromise()
      .then(response => {
        return EquipamentType.fromListData(response.json());
      });
  }

}
