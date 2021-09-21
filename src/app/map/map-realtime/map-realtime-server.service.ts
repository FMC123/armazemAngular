import { Page } from '../../shared/page/page';
import { MapPositionStorageUnit } from '../map-position/map-position-storage-unit';
import { AuthService } from './../../auth/auth.service';
import { Endpoints } from './../../endpoints';
import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';

@Injectable()
export class MapRealtimeServerService {

  constructor(
    private http: Http,
    private auth: AuthService
  ) {}

  syncStorageUnitsByWarehouse(warehouseId: string, syncDate: number): Promise<any> {
    let params = new URLSearchParams();
    if (!syncDate) {
      return Promise.reject('Ocorreu um erro ao sincronizar as storageUnits do servidor. A pesquisa inicial não foi realizada.');
    }
    params.append('syncDate', syncDate + '');
    return this.http
      .get(
        Endpoints.mapRealtimeSyncUrl(warehouseId) + '/all',
        { search: params }
      )
      .toPromise()
      .then(response => {
        return MapPositionStorageUnit.fromListData(
          response.json()
        );
      });
  }

  listStorageUnitsByWarehouse(warehouseId: string): Promise<Array<MapPositionStorageUnit>> {
    let params = new URLSearchParams();
    return this.http.get(
        Endpoints.mapRealtimeUrl(warehouseId) + '/all',
        { search: params }
      )
      .toPromise()
      .then(response => {
        return MapPositionStorageUnit.fromListData(
          response.json()
        );
      });
  }
}
