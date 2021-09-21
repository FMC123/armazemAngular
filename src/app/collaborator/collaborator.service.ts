import { Collaborator } from './collaborator';
import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';
import {toPromise} from 'rxjs/operator/toPromise';

@Injectable()
export class CollaboratorService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http: Http,
    private auth: AuthService
  ) {}

  list(search?: string): Promise<Array<Collaborator>> {
    let params = new URLSearchParams();
    params.append('limit', '10');

    if (search) {
      params.append('search', search ? search : '');
    }

    return this.http.get(Endpoints.collaboratorURL, {search: params})
      .toPromise()
      .then(response => {
        return Collaborator.fromListData(response.json());
      });
  }

  listActive(search?: string): Promise<Array<Collaborator>> {
    let params = new URLSearchParams();
    params.append('limit', '10');

    if (search) {
      params.append('search', search ? search : '');
    }

    return this.http.get(`${Endpoints.collaboratorURL}/active`, {search: params})
    .toPromise()
    .then(response => {
      return Collaborator.fromListData(response.json());
    });
  }

  listPaged(filter: any, page: Page<Collaborator>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('filter', filter ? filter : '');
    return this.http.get(`${Endpoints.collaboratorURL}/paged`,
    {
      search: params,
    })
    .toPromise()
    .then(response => {
      page.setResultFromServer(response.json());
      page.data = Collaborator.fromListData(page.data);
      return page;
    });
  }

  find(id: number | string) {
    let url = `${Endpoints.collaboratorURL}/${id}`;
    return this.http.get(url)
    .toPromise()
    .then(response => {
      let collaborator = Collaborator.fromData(response.json());

      return collaborator;
    });
  }

  save(collaborator: Collaborator): Promise<Collaborator> {
    if (collaborator.id) {
      return this.update(collaborator);
    }else {
      return this.create(collaborator);
    }
  }

  delete(id: number | string): Promise<void> {
  let url = `${Endpoints.collaboratorURL}/${id}`;
  return this.http.delete(url,
    {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
    .toPromise()
    .then(() => null);
  }

  private create(collaborator: Collaborator): Promise<Collaborator> {
    const url = `${Endpoints.collaboratorURL}`

    return this.http
      .post(url, collaborator,
      {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json());
  }

  private update(collaborator: Collaborator): Promise<Collaborator> {
    const url = `${Endpoints.collaboratorURL}/${collaborator.id}`;
    return this.http
    .put(url,
      collaborator,
      {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => collaborator);
  }
}
