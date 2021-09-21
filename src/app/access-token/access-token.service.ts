import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { AccessToken } from './../auth/access-token';
import { Endpoints } from './../endpoints';
import { Page } from './../shared/page/page';
import { AccessTokenFilter } from './access-token-filter';
import { AuthService } from './../auth/auth.service';

@Injectable()
export class AccessTokenService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  listPaged(filter: AccessTokenFilter, page: Page<AccessToken>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.appendAll(filter.toURLSearchParams())
    return this.http
      .get(
        `${Endpoints.accessAccessTokenUrl}/paged`,
        { search: params }
      )
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = AccessToken.fromListData(page.data);
        return page;
      });
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.accessAccessTokenUrl}/${id}`;
    return this.http
      .delete(
        url,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(() => null);
  }
}
