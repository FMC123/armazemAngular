import { Strainer } from './strainer';
import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';
import {toPromise} from "rxjs/operator/toPromise";

@Injectable()
export class StrainerService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  list(): Promise<Array<Strainer>> {
    return this.http.get(Endpoints.strainerURL)
                        .toPromise()
                        .then(response => {
                          return Strainer.fromListData(response.json());
                        });
  }


  listPaged(filter: any, page: Page<Strainer>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('search', filter ? filter : '');
    return this.http.get(`${Endpoints.strainerURL}/paged`,
                        {
                          search: params,
                        })
                        .toPromise()
                        .then(response => {
                          page.setResultFromServer(response.json());
                          page.data = Strainer.fromListData(page.data);
                          return page;
                        });
  }

  find(id: number | string) {
    let url = `${Endpoints.strainerURL}/${id}`;
    return this.http.get(url)
               .toPromise()
               .then(response => {
                 let strainer = Strainer.fromData(response.json());

                 return strainer;
               });
  }

  save(strainer: Strainer): Promise<Strainer> {
    if (strainer.id) {
      return this.update(strainer);
    }else {
      return this.create(strainer);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.strainerURL}/${id}`;
    return this.http.delete(url,
                            {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  private create(strainer: Strainer): Promise<Strainer> {
    const url = `${Endpoints.strainerURL}`
    return this.http
      .post(url, JSON.stringify(strainer),
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json());
  }

  private update(strainer: Strainer): Promise<Strainer> {
    const url = `${Endpoints.strainerURL}/${strainer.id}`;
    return this.http
      .put(url,strainer,{headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => Strainer);
  }
}
