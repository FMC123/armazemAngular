import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { AuthService } from '../../auth/auth.service';
import { Endpoints } from '../../endpoints';
import { PositionSacaria } from './position-sacaria';

@Injectable()
export class PositionSacariaService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  list(): Promise<Array<PositionSacaria>> {
    return this.http.get(
      `${Endpoints.positionsUrl(this.auth.accessToken.warehouse.id)}/sacaria`
    )
      .toPromise()
      .then(response => {
        return PositionSacaria.fromListData(response.json());
      });
  }
}
