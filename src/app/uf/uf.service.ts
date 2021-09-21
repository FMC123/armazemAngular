import { Uf } from './uf';
import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';
import {toPromise} from "rxjs/operator/toPromise";


@Injectable()
export class UfService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  list(): Promise<Array<Uf>> {
    return this.http.get(Endpoints.UfURL)
                        .toPromise()
                        .then(response => {
                          return Uf.fromListData(response.json());
                        });
  }


  listPaged(filter: any, page: Page<Uf>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('search', filter ? filter : '');
    return this.http.get(`${Endpoints.UfURL}/paged`,
                        {
                          search: params,
                        })
                        .toPromise()
                        .then(response => {
                          page.setResultFromServer(response.json());
                          page.data = Uf.fromListData(page.data);
                          return page;
                        });
  }

  find(id: number | string) {
    let url = `${Endpoints.UfURL}/${id}`;
    return this.http.get(url)
               .toPromise()
               .then(response => {
                 let uf = Uf.fromData(response.json());

                 return uf;
               });
  }

  save(uf: Uf): Promise<Uf> {
    ;
    if (uf.id) {
      return this.update(uf);
    }else {
      return this.create(uf);
    }
  }

  delete(code: number | string): Promise<void> {
    let url = `${Endpoints.UfURL}/${code}`;
    return this.http.delete(url,
                            {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  private create(uf: Uf): Promise<Uf> {
    const url = `${Endpoints.UfURL}`
    
    return this.http
      .post(url, JSON.stringify(uf),
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json());
  }

  private update(uf: Uf): Promise<Uf> {
    const url = `${Endpoints.UfURL}/${uf}`;
    return this.http
      .put(url,
           Uf
      ,
          {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => Uf);
  }
}
