import { Injectable } from '@angular/core';
import { Endpoints } from '../endpoints';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { AuthService } from '../auth/auth.service';
import { Page } from '../shared/page/page';

import { Forklift } from './forklift';


@Injectable()
export class ForkliftService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  list(): Promise<Array<Forklift>> {
    return this.http.get(Endpoints.forkliftUrl)
                        .toPromise()
                        .then(response => {
                          return Forklift.fromListData(response.json());
                        });
  }

  listPaged(filter: any, page: Page<Forklift>) {

    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('search', filter ? filter : '');
    return this.http.get(`${Endpoints.forkliftUrl}/paged`,
        {
          search: params,
        })
        .toPromise()
        .then(response => {
          page.setResultFromServer(response.json());
          page.data = Forklift.fromListData(page.data);
          return page;
        });
  }

  find(id: number | string) {
    let url = `${Endpoints.forkliftUrl}/${id}`;
    return this.http.get(url)
        .toPromise()
        .then(response => {
          let forklift = Forklift.fromData(response.json());
          return forklift;
        });
  }

  save(forklift: Forklift): Promise<Forklift> {
    if (forklift.id) {
      return this.update(forklift);
    }else {
      return this.create(forklift);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.forkliftUrl}/${id}`;
    return this.http.delete(url,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
        .toPromise()
        .then(() => null);
  }

  private create(forklift: Forklift): Promise<Forklift> {
    return this.http
        .post(Endpoints.forkliftUrl,
          JSON.stringify(forklift),
            {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
        .toPromise()
        .then(res => res.json().data);
  }

  private update(forklift: Forklift): Promise<Forklift> {
    const url = `${Endpoints.forkliftUrl}/${forklift.id}`;
    return this.http
        .put(url,
            forklift,
            {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
        .toPromise()
        .then(() => forklift);
  }

  changeForkliftActivationStatus (forklift: Forklift): Promise<Forklift> {
    const url = `${Endpoints.forkliftUrl}/${forklift.id}`;
    forklift.active = !forklift.active;
    return this.http
      .put(url,
        forklift,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => forklift);
  }
}
