import { ServiceGroupItem } from './service-group-item';
import { Page } from '../shared/page/page';

import { AuthService } from './../auth/auth.service';
import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Headers, Http , URLSearchParams} from '@angular/http';
import * as assert from 'assert';

@Injectable()
export class ServiceGroupItemService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  find(serviceGroupId: String, id: number | string) {
    let url = `${Endpoints.serviceGroupItemUrl(serviceGroupId)}/${id}`;
    return this.http.get(url)
               .toPromise()
               .then(response => ServiceGroupItem.fromData(response.json()));
  }

    list(serviceGroupId: String) {
        return this.http.get(`${Endpoints.serviceGroupItemUrl(serviceGroupId)}`)
                            .toPromise()
                            .then(response => {
                            return ServiceGroupItem.fromListData(response.json());
                            });
    }

    listPaged(serviceGroupId: String, filter: any, page: Page<ServiceGroupItem>) {
        let params = new URLSearchParams();
        params.appendAll(page.toURLSearchParams());
        params.append('filter', filter ? filter : '');
        return this.http.get(`${Endpoints.serviceGroupItemUrl(serviceGroupId)}/paged`,
                        {
                          search: params,
                        })
                        .toPromise()
                        .then(response => {
                          page.setResultFromServer(response.json());
                          page.data = ServiceGroupItem.fromListData(page.data);
                          return page;
                        });
    }

    save(serviceGroupItem: ServiceGroupItem): Promise<ServiceGroupItem> {
        if (serviceGroupItem.id) {
            return this.update(serviceGroupItem);
        }else {
            return this.create(serviceGroupItem);
        }
  }

  delete(serviceGroupId: String, id: number | string): Promise<void> {
    let url = `${Endpoints.serviceGroupItemUrl(serviceGroupId)}/${id}`;
    return this.http.delete(url,
                            {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  private create(serviceGroupItem: ServiceGroupItem): Promise<ServiceGroupItem> {
    return this.http
      .post(Endpoints.serviceGroupItemUrl(serviceGroupItem.serviceGroup.id), 
          JSON.stringify(serviceGroupItem),
          {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json().data);
  }

  private update(serviceGroupItem: ServiceGroupItem): Promise<ServiceGroupItem> {
      const url = `${Endpoints.serviceGroupItemUrl(serviceGroupItem.serviceGroup.id)}`;
      return this.http
        .put(url, JSON.stringify(serviceGroupItem),
            {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
        .toPromise()
        .then(res => ServiceGroupItem.fromData(res.json()));
    }
}
