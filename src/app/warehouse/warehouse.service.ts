import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { Warehouse } from './warehouse';
import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';


@Injectable()
export class WarehouseService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  list(): Promise<Array<Warehouse>> {
    return this.http.get(Endpoints.warehouseUrl)
                        .toPromise()
                        .then(response => {
                          return Warehouse.fromListData(response.json());
                        });
  }

  listParentCandidates(): Promise<Array<Warehouse>>{
    return this.http.get(Endpoints.warehouseParentCandidateUrl)
                    .toPromise()
                    .then(response => {
                      return Warehouse.fromListData(response.json());
                    });
  }

  listPaged(filter: any, page: Page<Warehouse>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('search', filter ? filter : '');
    return this.http.get(`${Endpoints.warehouseUrl}/paged`,
                        {
                          search: params,
                        })
                        .toPromise()
                        .then(response => {
                          page.setResultFromServer(response.json());
                          page.data = Warehouse.fromListData(page.data);
                          return page;
                        });
  }

  find(id: number | string) {
    let url = `${Endpoints.warehouseUrl}/${id}`;
    return this.http.get(url)
               .toPromise()
               .then(response => {
                 let warehouse = Warehouse.fromData(response.json().warehouse);
                 return warehouse;
               });
  }

  save(warehouse: Warehouse): Promise<Warehouse> {
    if (warehouse.id) {
      return this.update(warehouse);
    }else {
      return this.create(warehouse);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.warehouseUrl}/${id}`;
    return this.http.delete(url,
                            {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  private create(warehouse: Warehouse): Promise<Warehouse> {
    return this.http
      .post(Endpoints.warehouseUrl, {
        warehouse: warehouse
      },
          {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json().data);
  }

  private update(warehouse: Warehouse): Promise<Warehouse> {
    const url = `${Endpoints.warehouseUrl}/${warehouse.id}`;
    return this.http
      .put(url, {
        warehouse: warehouse
      },
          {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => warehouse);
  }
}
