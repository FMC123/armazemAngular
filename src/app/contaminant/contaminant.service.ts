import {Injectable} from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';

import {Endpoints} from '../endpoints';
import {Page} from '../shared/page/page';
import {AuthService} from '../auth/auth.service';
import {Contaminant} from "./contaminant";
import {ErrorHandler} from "../shared/shared.module";

@Injectable()
export class ContaminantService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService,
              private errorHandler: ErrorHandler) {
  }

  list(): Promise<Array<Contaminant>> {
    return this.http.get(
      `${Endpoints.contaminantUrl}`)
      .toPromise()
      .then(response => {
        return Contaminant.fromListData(response.json());
      })
      .catch(error => {
        return this.handleError(error);
      });
  }

  listPaged(filter: any, page: Page<Contaminant>): Promise<Page<Contaminant>> {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('search', filter ? filter : '');
    return this.http
      .get(
        `${Endpoints.contaminantUrl}/paged`,
        {search: params}
      )
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = Contaminant.fromListData(page.data);
        return page;
      })
      .catch(error => {
        return this.handleError(error);
      });
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.contaminantUrl}/${id}`;
    return this.http
      .delete(
        url,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(() => null)
      .catch(error => {
        return this.handleError(error);
      });
  }

  create(contaminant: Contaminant, send: boolean): Promise<Contaminant> {
    const url = `${Endpoints.contaminantUrl}`;
    let params = new URLSearchParams();
    params.append('send', '' + send);

    return this.http
      .post(url, JSON.stringify(contaminant), {
        headers: this.auth.appendOrCreateAuthHeader(this.headers),
        search: params
      })
      .toPromise()
      .then(res => res.json())
      .catch(error => {
        return this.handleError(error);
      });
  }

  update(contaminant: Contaminant): Promise<Contaminant> {
    const url = `${Endpoints.contaminantUrl}/${contaminant.id}`;
    return this.http
      .put(url, contaminant, {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => contaminant)
      .catch(error => {
        return this.handleError(error);
      });
  }

  find(id: number | string): Promise<Contaminant> {
    const url = `${Endpoints.contaminantUrl}/${id}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => {
        let contaminant = Contaminant.fromData(response.json());
        return contaminant;
      })
      .catch(error => {
        return this.handleError(error);
      });
  }

  private handleError(error) {
    return this.errorHandler.fromServer(error);
  }
}
