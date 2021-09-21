import { Farm } from './farm';
import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';
import { toPromise } from "rxjs/operator/toPromise";


@Injectable()
export class FarmService {
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http,
    private auth: AuthService) { }

  list() {
    return this.http.get(`${Endpoints.farmUrl}`)
      .toPromise()
      .then(response => {
        return Farm.fromListData(response.json());
      });
  }


  listPaged(filter: any, page: Page<Farm>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('filter', filter ? filter : '');
    return this.http.get(`${Endpoints.farmUrl}/paged`,
      {
        search: params,
      })
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = Farm.fromListData(page.data);
        return page;
      });
  }


  find(id: number | string) {
    let url = `${Endpoints.farmUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        let farm = Farm.fromData(response.json());

        return farm;
      });
  }

  /**
   * Busca para autocomplete de dados
   * @param search 
   */
  autocomplete(search?: string): Promise<Array<Farm>> {

    let params = new URLSearchParams();
    params.append('limit', '10');

    if (search) {
      params.append('search', search ? search : '');
    }

    return this.http.get(`${Endpoints.farmUrl}/autocomplete`, { search: params })
      .toPromise()
      .then(response => {
        return Farm.fromListData(response.json());
      });
  }

  save(farm: Farm): Promise<Farm> {
    if (farm.id) {
      return this.update(farm);
    } else {
      return this.create(farm);
    }
  }


  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.farmUrl}/${id}`;
    return this.http.delete(url,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(() => null);
  }


  private create(farm: Farm): Promise<Farm> {
    return this.http
      .post(Endpoints.farmUrl, JSON.stringify(farm),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => Farm.fromData(res.json()));
  }

  private update(farm: Farm): Promise<Farm> {
    const url = `${Endpoints.farmUrl}/${farm.id}`;
    return this.http
      .put(url, JSON.stringify(farm),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => Farm.fromData(res.json()));
  }
}