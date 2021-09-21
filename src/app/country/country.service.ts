import { Country } from './country';
import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';
import {toPromise} from "rxjs/operator/toPromise";


@Injectable()
export class CountryService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  list(): Promise<Array<Country>> {
    return this.http.get(Endpoints.CountryURL)
                        .toPromise()
                        .then(response => {
                          return Country.fromListData(response.json());
                        });
  }


  listPaged(filter: any, page: Page<Country>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('search', filter ? filter : '');
    return this.http.get(`${Endpoints.CountryURL}/paged`,
                        {
                          search: params,
                        })
                        .toPromise()
                        .then(response => {
                          page.setResultFromServer(response.json());
                          page.data = Country.fromListData(page.data);
                          return page;
                        });
  }

  find(id: number | string) {
    let url = `${Endpoints.CountryURL}/${id}`;
    return this.http.get(url)
               .toPromise()
               .then(response => {
                 let country = Country.fromData(response.json());

                 return country;
               });
  }

  save(country: Country): Promise<Country> {
    ;
    if (country.id) {
      return this.update(country);
    }else {
      return this.create(country);
    }
  }

  delete(code: number | string): Promise<void> {
    let url = `${Endpoints.CountryURL}/${code}`;
    return this.http.delete(url,
                            {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  private create(country: Country): Promise<Country> {
    const url = `${Endpoints.CountryURL}`
    
    return this.http
      .post(url, JSON.stringify(country),
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json());
  }

  private update(country: Country): Promise<Country> {
    const url = `${Endpoints.CountryURL}/${country.code}`;
    return this.http
      .put(url,
           Country
      ,
          {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => Country);
  }
}
