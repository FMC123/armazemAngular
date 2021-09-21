import { ServiceGroup } from './service-group';
import { Page } from '../shared/page/page';

import { AuthService } from './../auth/auth.service';
import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Headers, Http , URLSearchParams} from '@angular/http';
import * as assert from 'assert';

@Injectable()
export class ServiceGroupService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  find(id: number | string) {
    let url = `${Endpoints.serviceGroupUrl}/${id}`;
    return this.http.get(url)
               .toPromise()
               .then(response => ServiceGroup.fromData(response.json()));
  }

    list() {
        return this.http.get(`${Endpoints.serviceGroupUrl}`)
                            .toPromise()
                            .then(response => {
                            return ServiceGroup.fromListData(response.json());
                            });
    }

    listPaged(filter: any, page: Page<ServiceGroup>) {
        let params = new URLSearchParams();
        params.appendAll(page.toURLSearchParams());
        params.append('filter', filter ? filter : '');
        return this.http.get(`${Endpoints.serviceGroupUrl}/paged`,
                        {
                          search: params,
                        })
                        .toPromise()
                        .then(response => {
                          page.setResultFromServer(response.json());
                          page.data = ServiceGroup.fromListData(page.data);
                          return page;
                        });
    }

    save(serviceGroup: ServiceGroup): Promise<ServiceGroup> {
        if (serviceGroup.id) {
            return this.update(serviceGroup);
        }else {
            return this.create(serviceGroup);
        }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.serviceGroupUrl}/${id}`;
    return this.http.delete(url,
                            {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  private create(serviceGroup: ServiceGroup): Promise<ServiceGroup> {
    return this.http
      .post(Endpoints.serviceGroupUrl, 
          JSON.stringify(serviceGroup),
          {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json().data);
  }

  private update(serviceGroup: ServiceGroup): Promise<ServiceGroup> {
      const url = `${Endpoints.serviceGroupUrl}`;
      return this.http
        .put(url, JSON.stringify(serviceGroup),
            {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
        .toPromise()
        .then(res => ServiceGroup.fromData(res.json()));
    }
}
