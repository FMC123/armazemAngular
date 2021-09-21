import { MapPositionLayer } from '../map-position/map-position-layer';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { Endpoints } from './../../endpoints';
import { MapPosition } from './../map-position/map-position';
import { AuthService } from './../../auth/auth.service';

@Injectable()
export class MapPositionServerService {

  constructor(private http: Http,
              private auth: AuthService) {}

  listByWarehouse(warehouseId: string): Promise<Array<MapPositionLayer>> {
    let params = new URLSearchParams();
    return this.http.get(Endpoints.mapPositionsUrl(warehouseId),
                        {
                          search: params
                        })
                        .toPromise()
                        .then(response => {
                          return MapPositionLayer.fromListData(response.json());
                        });
  }
}
