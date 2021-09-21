import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { WarehouseStakeholder } from './warehouse-stakeholder';
import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';


@Injectable()
export class WarehouseStakeholderService {
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http,
    private auth: AuthService) { }

  list(search?: string): Promise<Array<WarehouseStakeholder>> {
    let params = new URLSearchParams();
    params.append('search', search ? search : '');
    params.append('limit', '10');

    return this.http.get(
      Endpoints.WarehouseStakeholderUrl,
      { search: params },
    )
      .toPromise()
      .then(response => {
        return WarehouseStakeholder.fromListData(response.json());
      });
  }


  listPaged(filterName: any, filterTradingName: any, filterDocument: any, page: Page<WarehouseStakeholder>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('filterName', filterName ? filterName : '');
    params.append('filterTradingName', filterTradingName ? filterTradingName : '');
    params.append('filterDocument', filterDocument ? filterDocument : '');
    return this.http.get(`${Endpoints.WarehouseStakeholderUrl}/paged`,
      {
        search: params,
      })
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = WarehouseStakeholder.fromListData(page.data);
        return page;
      });
  }

  find(id: number | string) {
    let url = `${Endpoints.WarehouseStakeholderUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        let warehouseStakeholder = WarehouseStakeholder.fromData(response.json());
        return warehouseStakeholder;
      });
  }

  save(warehouseStakeholder: WarehouseStakeholder): Promise<WarehouseStakeholder> {

    if (warehouseStakeholder.id) {
      return this.update(warehouseStakeholder);
    } else {
      return this.create(warehouseStakeholder);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.WarehouseStakeholderUrl}/${id}`;
    return this.http.delete(url,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(() => null);
  }

  findByPerson(personId: string) {
    let url = `${Endpoints.WarehouseStakeholderUrl}/person/${personId}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => {
        if (!response.text()) {
          return null;
        }

        let warehouseStakeholder = WarehouseStakeholder.fromData(response.json());
        return warehouseStakeholder;
      });
  }

  findByDocument(document: string) {
    let url = `${Endpoints.WarehouseStakeholderUrl}/document/${document}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => {
        if (!response.text()) {
          return null;
        }

        let warehouseStakeholder = WarehouseStakeholder.fromData(response.json());
        return warehouseStakeholder;
      });
  }

  private create(warehouseStakeholder: WarehouseStakeholder): Promise<WarehouseStakeholder> {
    return this.http
      .post(
        Endpoints.WarehouseStakeholderUrl,
        warehouseStakeholder,
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then(res => res.json().data);
  }

  private update(warehouseStakeholder: WarehouseStakeholder): Promise<WarehouseStakeholder> {
    const url = `${Endpoints.WarehouseStakeholderUrl}/${warehouseStakeholder.id}`;
    return this.http
      .put(
        url,
        warehouseStakeholder,
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then(() => warehouseStakeholder);
  }

  /**
   * Salva de modo simplificado, junto com a pessoa
   * @param warehouseStakeholder
   */
  public saveSimplifiedWay(warehouseStakeholder: WarehouseStakeholder): Promise<WarehouseStakeholder> {
    return this.http
      .post(
        Endpoints.WarehouseStakeholderUrl + '/save-simplified-way',
        warehouseStakeholder,
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then(response => {

        if (!response.text()) {
          return null;
        }

        let warehouseStakeholder = WarehouseStakeholder.fromData(response.json());
        return warehouseStakeholder;
      });
  }
}
