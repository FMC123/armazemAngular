import { IntegrationLogFilter } from './integration-log.filter';
import { IntegrationLog } from './integration-log';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import {AuthService} from "../../../auth/auth.service";
import {Page} from "../../../shared/page/page";
import {Endpoints} from "../../../endpoints";



@Injectable()
export class FunctionLogService {
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    private http: Http,
    private auth: AuthService
  ) { }

  list(): Promise<Array<IntegrationLog>> {
    return this.http.get(Endpoints.integrationLogUrl)
                        .toPromise()
                        .then(response => {
                          return IntegrationLog.fromListData(response.json());
                        });
  }


  listPaged(filter: IntegrationLogFilter, page: Page<IntegrationLog>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.appendAll(filter.toURLSearchParams());
    return this.http.get(
      `${Endpoints.integrationLogUrl}/paged`,
      { search: params }
    )
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = IntegrationLog.fromListData(page.data);
        return page;
      });
  }
 
  urlList(): Promise<Array<string>>{
    let url = `${Endpoints.integrationLogUrl}/urlList`
    return this.http
      .get( 
        url,
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      ).toPromise()
      .then(response => {
        return response.json();
      })
    }


  resend(id: number | string): Promise<void> {
    let url = `${Endpoints.integrationLogUrl}/${id}/resend`;
    return this.http
      .put(
      url,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then(() =>  null);
  }
}
