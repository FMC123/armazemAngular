import { ServiceGroupItemPrice } from './service-group-item-price';
import { Page } from '../shared/page/page';

import { AuthService } from './../auth/auth.service';
import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Headers, Http , URLSearchParams} from '@angular/http';
import * as assert from 'assert';

@Injectable()
export class ServiceGroupItemPriceService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  find(serviceGroupItemId: String, id: number | string) {
    let url = `${Endpoints.serviceGroupItemPriceUrl(serviceGroupItemId)}/${id}`;
    return this.http.get(url)
            .toPromise()
            .then(response => ServiceGroupItemPrice.fromData(response.json()));
  }

    list(serviceGroupItemId: String) {
        return this.http.get(`${Endpoints.serviceGroupItemPriceUrl(serviceGroupItemId)}`)
                            .toPromise()
                            .then(response => {
                            return ServiceGroupItemPrice.fromListData(response.json());
                            });
    }

    listPaged(serviceGroupItemId: String, filter: any, page: Page<ServiceGroupItemPrice>) {
        let params = new URLSearchParams();
        params.appendAll(page.toURLSearchParams());
        params.append('filter', filter ? filter : '');
        return this.http.get(`${Endpoints.serviceGroupItemPriceUrl(serviceGroupItemId)}/paged`,
                        {
                          search: params,
                        })
                        .toPromise()
                        .then(response => {
                          page.setResultFromServer(response.json());
                          page.data = ServiceGroupItemPrice.fromListData(page.data);
                          return page;
                        });
    }

    save(serviceGroupItemPrice: ServiceGroupItemPrice): Promise<ServiceGroupItemPrice> {
        if (serviceGroupItemPrice.id) {
            return this.update(serviceGroupItemPrice);
        }else {
            return this.create(serviceGroupItemPrice);
        }
  }

  delete(serviceGroupItemId: String, id: number | string): Promise<void> {
      ;
    let url = `${Endpoints.serviceGroupItemPriceUrl(serviceGroupItemId)}/${id}`;
    return this.http.delete(url,
                            {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  private create(serviceGroupItemPrice: ServiceGroupItemPrice): Promise<ServiceGroupItemPrice> {
    return this.http
      .post(Endpoints.serviceGroupItemPriceUrl(serviceGroupItemPrice.serviceGroupItem.id),
          JSON.stringify(serviceGroupItemPrice),
          {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json().data);
  }

  private update(serviceGroupItemPrice: ServiceGroupItemPrice): Promise<ServiceGroupItemPrice> {
      const url = `${Endpoints.serviceGroupItemPriceUrl(serviceGroupItemPrice.serviceGroupItem.id)}`;
      return this.http
        .put(url, JSON.stringify(serviceGroupItemPrice),
          {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
        .toPromise()
        .then(res => ServiceGroupItemPrice.fromData(res.json()));
    }
}
