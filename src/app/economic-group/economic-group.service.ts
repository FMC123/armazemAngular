import { EconomicGroup } from './economic-group';
import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';
import {toPromise} from 'rxjs/operator/toPromise';

@Injectable()
export class EconomicGroupService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  list(): Promise<Array<EconomicGroup>> {
    return this.http.get(Endpoints.economicGroupURL)
                        .toPromise()
                        .then(response => {
                          return EconomicGroup.fromListData(response.json());
                        });
  }


  listPaged(filter: any, page: Page<EconomicGroup>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('filter', filter ? filter : '');
    return this.http.get(`${Endpoints.economicGroupURL}/paged`,
                        {
                          search: params,
                        })
                        .toPromise()
                        .then(response => {
                          page.setResultFromServer(response.json());
                          page.data = EconomicGroup.fromListData(page.data);
                          return page;
                        });
  }

  find(id: number | string) {
    let url = `${Endpoints.economicGroupURL}/${id}`;
    return this.http.get(url)
               .toPromise()
               .then(response => {
                 let economicGroup = EconomicGroup.fromData(response.json());

                 return economicGroup;
               });
  }

  save(economicGroup: EconomicGroup): Promise<EconomicGroup> {
    if (economicGroup.id) {
      return this.update(economicGroup);
    }else {
      return this.create(economicGroup);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.economicGroupURL}/${id}`;
    return this.http.delete(url,
                            {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  private create(economicGroup: EconomicGroup): Promise<EconomicGroup> {
    const url = `${Endpoints.economicGroupURL}`
    return this.http
      .post(url, JSON.stringify(economicGroup),
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json());
  }

  private update(economicGroup: EconomicGroup): Promise<EconomicGroup> {
    const url = `${Endpoints.economicGroupURL}/${economicGroup.id}`;
    return this.http
      .put(url, JSON.stringify(economicGroup), {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json());
  }
}
