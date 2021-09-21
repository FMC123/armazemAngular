import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import {MapZonePositionLayer} from "./map-zone-position-layer";
import {AuthService} from "../../../auth/auth.service";
import {Endpoints} from "../../../endpoints";

@Injectable()
export class MapZonePositionServerService {

  constructor(private http: Http,
              private auth: AuthService) {}

  listByWarehouse(warehouseId: string): Promise<Array<MapZonePositionLayer>> {
    let params = new URLSearchParams();
    return this.http.get(Endpoints.mapPositionsUrl(warehouseId),
                        {
                          search: params
                        })
                        .toPromise()
                        .then(response => {
                          return MapZonePositionLayer.fromListData(response.json());
                        });
  }
}
