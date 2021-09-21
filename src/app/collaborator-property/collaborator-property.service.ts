import { Farm } from '../farm/farm';
import { Endpoints } from '../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { AuthService } from '../auth/auth.service';
import { Page } from '../shared/page/page';
import { toPromise } from 'rxjs/operator/toPromise';
import {CollaboratorProperty} from "./collaborator-property";

@Injectable()
export class CollaboratorPropertyService {
  private headers = new Headers({'Content-type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  list(): Promise<Array<CollaboratorProperty>> {
      return this.http.get(Endpoints.collaboratorPropertyUrl)
                          .toPromise()
                          .then(response => {
                            return CollaboratorProperty.fromListData(response.json());
                          });
  }

  listFarmsBycollaborator(collaboratorId: string) {
    if (!collaboratorId) {
      return Promise.resolve([]);
    }

    return this.http.get(`${Endpoints.collaboratorPropertyUrl}/collaborator/${collaboratorId}`)
      .toPromise()
      .then(response => {
        return Farm.fromListData(response.json().map(j => j.farm));
      });
  }

  listPaged(filter: any, page: Page<CollaboratorProperty>) {
      let params = new URLSearchParams();
      params.appendAll(page.toURLSearchParams());
      params.append('search', filter ? filter : '');
      return this.http.get(`${Endpoints.collaboratorPropertyUrl}/paged`,
                          {
                              search: params,
                          })
                          .toPromise()
                          .then(response => {
                            page.setResultFromServer(response.json());
                            page.data = CollaboratorProperty.fromListData(page.data);
                            return page;
                          });
  }

  find(id: number | string) {
    let url = `${Endpoints.collaboratorPropertyUrl}/${id}`;
    return this.http.get(url)
        .toPromise()
        .then(response => {
        let collaboratorproperty = CollaboratorProperty.fromData(response.json());
        return collaboratorproperty;
        });
  }

  save(collaboratorProperty: CollaboratorProperty): Promise<CollaboratorProperty> {
    if (collaboratorProperty.id) {
      return this.update(collaboratorProperty);
    }else {
      return this.create(collaboratorProperty);
    }
  }

  delete(id: number | string): Promise<void> {
    const url = `${Endpoints.collaboratorPropertyUrl}/${id}`;
    return this.http.delete(url,
      {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  private create(collaboratorProperty: CollaboratorProperty): Promise<CollaboratorProperty> {
    const url = `${Endpoints.collaboratorPropertyUrl}`;
    return this.http
      .post(url, JSON.stringify(collaboratorProperty),
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json());
  }

  private update(collaboratorProperty: CollaboratorProperty): Promise<CollaboratorProperty> {
    const url = `${Endpoints.collaboratorPropertyUrl}/${collaboratorProperty.id}`;
    return this.http
      .put(
        url,
        collaboratorProperty,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(() => collaboratorProperty);
  }

}
