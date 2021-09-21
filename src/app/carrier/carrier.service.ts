import { Carrier } from './carrier';
import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';
import {toPromise} from "rxjs/operator/toPromise";


@Injectable()
export class CarrierService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  list(): Promise<Array<Carrier>> {
    return this.http.get(Endpoints.CarrierURL)
                        .toPromise()
                        .then(response => {
                          return Carrier.fromListData(response.json());
                        });
  }


  listPaged(filter: any, page: Page<Carrier>) {

    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('filter', filter ? filter : '');
    return this.http.get(`${Endpoints.CarrierURL}/paged`,
                        {
                          search: params,
                        })
                        .toPromise()
                        .then(response => {
                          page.setResultFromServer(response.json());
                          page.data = Carrier.fromListData(page.data);
                          return page;
                        });
  }

  find(id: number | string) {
    let url = `${Endpoints.CarrierURL}/${id}`;
    return this.http.get(url)
               .toPromise()
               .then(response => {
                 let carrier = Carrier.fromData(response.json());

                 return carrier;
               });
  }

  save(carrier: Carrier): Promise<Carrier> {
    if (carrier.id) {
      return this.update(carrier);
    }else {
      return this.create(carrier);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.CarrierURL}/${id}`;
    return this.http.delete(url,
    {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  private create(carrier: Carrier): Promise<Carrier> {
    const url = `${Endpoints.CarrierURL}`

    return this.http
      .post(url, carrier,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json());
  }

  private update(carrier: Carrier): Promise<Carrier> {
    const url = `${Endpoints.CarrierURL}/${carrier.id}`;
    return this.http
      .put(url,
           carrier,
          {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => carrier);
  }
}
