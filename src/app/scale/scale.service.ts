import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import {Scale} from './scale';
import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';
import {toPromise} from "rxjs/operator/toPromise";


@Injectable()
export class ScaleService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  list(): Promise<Array<Scale>> {
    return this.http.get(Endpoints.scaleUrl)
                        .toPromise()
                        .then(response => {
                          return Scale.fromListData(response.json());
                        });
  }


  listPaged(filter: any, page: Page<Scale>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('search', filter ? filter : '');
    return this.http.get(`${Endpoints.scaleUrl}/paged`,
                        {
                          search: params,
                        })
                        .toPromise()
                        .then(response => {
                          page.setResultFromServer(response.json());
                          page.data = Scale.fromListData(page.data);
                          return page;
                        });
  }

  find(id: number | string) {
    let url = `${Endpoints.scaleUrl}/${id}`;
    return this.http.get(url)
        .toPromise()
        .then(response => {
        let scale = Scale.fromData(response.json());
        return scale;
          });
  }

  save(scale: Scale): Promise<Scale> {
    if (scale.id) {
      return this.update(scale);
    }else {
      return this.create(scale);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.scaleUrl}/${id}`;
    return this.http.delete(url,
      {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  private create(scale: Scale): Promise<Scale> {
    const url = `${Endpoints.scaleUrl}`
    return this.http
      .post(url, JSON.stringify(scale),
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json());
  }

  private update(scale: Scale): Promise<Scale> {
    const url = `${Endpoints.scaleUrl}/${scale.id}`;
    return this.http
      .put(url,scale
      ,
          {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => scale);
  }
}
