import { ServiceItem } from './service-item';
import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';
import { toPromise } from "rxjs/operator/toPromise";


@Injectable()
export class ServiceItemService {
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http,
    private auth: AuthService) { }

  list(): Promise<Array<ServiceItem>> {
    return this.http.get(Endpoints.ItemURL)
      .toPromise()
      .then(response => {
        return ServiceItem.fromListData(response.json());
      });
  }

  listToServiceInstruction(): Promise<Array<ServiceItem>> {
    return this.http.get(Endpoints.ItemURL + '/toServiceInstruction')
      .toPromise()
      .then(response => {
        return ServiceItem.fromListData(response.json());
      });
  }

  listToServiceCharge(): Promise<Array<ServiceItem>> {
    return this.http.get(Endpoints.ItemURL + '/toServiceCharge')
      .toPromise()
      .then(response => {
        return ServiceItem.fromListData(response.json());
      });
  }

  listPaged(filter: any, page: Page<ServiceItem>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('filter', filter ? filter : '');
    return this.http.get(`${Endpoints.ItemURL}/paged`,
      {
        search: params,
      })
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = ServiceItem.fromListData(page.data);
        return page;
      });
  }

  find(id: number | string) {
    let url = `${Endpoints.ItemURL}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        let item = ServiceItem.fromData(response.json());

        return item;
      });
  }

  save(item: ServiceItem): Promise<ServiceItem> {
    if (item.id) {
      return this.update(item);
    } else {
      return this.create(item);
    }
  }

  delete(code: number | string): Promise<void> {
    let url = `${Endpoints.ItemURL}/${code}`;
    return this.http.delete(url,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(() => null);
  }

  private create(item: ServiceItem): Promise<ServiceItem> {
    const url = `${Endpoints.ItemURL}`
    return this.http
      .post(url, JSON.stringify(item),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => ServiceItem.fromData(res.json()));
  }


  private update(item: ServiceItem): Promise<ServiceItem> {
    const url = `${Endpoints.ItemURL}`;
    return this.http
      .put(url, JSON.stringify(item),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => ServiceItem.fromData(res.json()));
  }
}
