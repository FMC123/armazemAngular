import { Http } from '@angular/http';
import { AuthService } from '../../auth/auth.service';
import { Endpoints } from '../../endpoints';
import { Injectable } from '@angular/core';

import { ModBusEquipament } from './mod-bus-equipament';

@Injectable()
export class ModBusEquipamentService {

  constructor(
    private http: Http,
    private auth: AuthService,
  ) {}

  list(): Promise<Array<ModBusEquipament>> {

    return this.http.get(`${Endpoints.equipamentUrl}/modbusmodellist`)
      .toPromise()
      .then(response => {
        return ModBusEquipament.fromListData(response.json());
      });
  }

}
