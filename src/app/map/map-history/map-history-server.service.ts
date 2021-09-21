import { MapPositionLayer } from '../map-position/map-position-layer';
import { MapHistory } from './map-history';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { Endpoints } from './../../endpoints';
import { MapPosition } from './../map-position/map-position';
import { AuthService } from './../../auth/auth.service';

@Injectable()
export class MapHistoryServerService {

  constructor(private http: Http,
              private auth: AuthService) {}

  find(warehouseId: string,
       date: number): Promise<MapHistory> {
    let params = new URLSearchParams();
    params.append('day', date + '');
    return this.http.get(Endpoints.mapHistoryUrl(warehouseId),
                        {
                          search: params
                        })
                        .toPromise()
                        .then(response => {
                          return MapHistory.fromData(response.json());
                        });
  }

}
