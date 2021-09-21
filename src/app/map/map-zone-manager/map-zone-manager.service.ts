import { AuthService } from '../../auth/auth.service';
import { Zone } from '../../zone/zone';
import { Endpoints } from '../../endpoints';
import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class MapZoneManagerService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http: Http,
    private auth: AuthService,
  ) { }

  list(): Promise<Array<Zone>> {
    return this.http.get(
      Endpoints.axGetMap
    )
    .toPromise()
    .then(response => {
      return Zone.fromListData(response.json());
    });
  }

  save(zones: Array<Zone>): Promise<void> {
    return this.http.post(
      Endpoints.axPostMap,
      zones,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers)}
    )
    .toPromise()
    .then(response => {
      try {
        let statuses = response.json();
        if (!statuses || !statuses.length) {
          throw new Error('');
        }

        if (!!statuses.find(s => s.status < 1)) {
          throw new Error('');
        }

        return Promise.resolve();
      } catch (error) {
        return Promise.reject('Ops, ocorreu um erro ao salvar as zonas do mapa!');
      }
    });
  }

}
