
import { Uf } from '../uf/uf';
import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';
import { toPromise } from 'rxjs/operator/toPromise';
import { City } from "app/city/city";


@Injectable()
export class CityService {
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http,
    private auth: AuthService) { }

  list(): Promise<Array<City>> {
    return this.http.get(Endpoints.CityURL)
      .toPromise()
      .then(response => {
        return City.fromListData(response.json());
      });
  }

  listByUf(uf: any): Promise<Array<City>> {
    let ufCity = new URLSearchParams();
    ufCity.append('uf', uf);

    return this.http.get(`${Endpoints.CityURL}/${uf}`)
      .toPromise()
      .then(response => {
        return City.fromListData(response.json());
      });
  }

  listPaged(filter: any, page: Page<City>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('search', filter ? filter : '');
    return this.http.get(`${Endpoints.CityURL}/paged`,
      {
        search: params,
      })
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = City.fromListData(page.data);
        return page;
      });
  }

  find(id: number | string) {
    let url = `${Endpoints.CityURL}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        let city = City.fromData(response.json());

        return city;
      });
  }

  save(city: City): Promise<City> {

    if (city.id) {
      return this.update(city);
    } else {
      return this.create(city);
    }
  }

  delete(code: number | string): Promise<void> {
    let url = `${Endpoints.CityURL}/${code}`;
    return this.http.delete(url,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(() => null);
  }

  private create(city: City): Promise<City> {
    const url = `${Endpoints.CityURL}`;
    return this.http
      .post(url, JSON.stringify(city),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => res.json());
  }

  private update(city: City): Promise<City> {
    const url = `${Endpoints.CityURL}/${city.id}`;
    return this.http
      .put(url, JSON.stringify(city),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => res.json());
  }

  /**
   * Busca para autocomplete de dados
   * @param search 
   */
  autoComplete(search?: string): Promise<Array<City>> {

    let params = new URLSearchParams();
    params.append('limit', '10');

    if (search) {
      params.append('search', search ? search : '');
    }

    return this.http.get(`${Endpoints.CityURL}/autocomplete`, { search: params })
      .toPromise()
      .then(response => {
        return City.fromListData(response.json());
      });
  }
}