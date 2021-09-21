import { Cultivation } from './cultivation';
import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';

@Injectable()
export class CultivationService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  list(): Promise<Array<Cultivation>> {
    return this.http.get(Endpoints.cultivationURL)
                        .toPromise()
                        .then(response => {
                          return Cultivation.fromListData(response.json());
                        });
  }


  listPaged(filter: any, page: Page<Cultivation>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('search', filter ? filter : '');
    return this.http.get(`${Endpoints.cultivationURL}/paged`,
                        {
                          search: params,
                        })
                        .toPromise()
                        .then(response => {
                          page.setResultFromServer(response.json());
                          page.data = Cultivation.fromListData(page.data);
                          return page;
                        });
  }

  find(id: number | string) {
    let url = `${Endpoints.cultivationURL}/${id}`;
    return this.http.get(url)
               .toPromise()
               .then(response => {
                 let cultivation = Cultivation.fromData(response.json());

                 return cultivation;
               });
  }

  save(cultivation: Cultivation): Promise<Cultivation> {
    if (cultivation.id) {
      return this.update(cultivation);
    }else {
      return this.create(cultivation);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.cultivationURL}/${id}`;
    return this.http.delete(url,
    {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  private create(cultivation: Cultivation): Promise<Cultivation> {
    const url = `${Endpoints.cultivationURL}`

    return this.http
      .post(url, JSON.stringify(cultivation),
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json());
  }

  private update(cultivation: Cultivation): Promise<Cultivation> {
    const url = `${Endpoints.cultivationURL}/${cultivation.id}`;
    return this.http
      .put(url, cultivation, {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => Cultivation);
  }
}
