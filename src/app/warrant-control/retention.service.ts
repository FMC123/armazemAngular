import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import {Http, Headers, URLSearchParams, ResponseContentType} from '@angular/http';

import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';
import {Retention} from "./retention";
import {RetentionFilter} from "./retention-filter";
import {RetentionGroup} from "./retention-group";

@Injectable()
export class RetentionService {
  private headers = new Headers({'Content-Type': 'application/json'});
  retentionSum: number;

  constructor(private http: Http,
              private auth: AuthService) {}

  list(): Promise<Array<Retention>> {
    return this.http.get(Endpoints.retentionUrl)
      .toPromise()
      .then(response => {
        return Retention.fromListData(response.json());
      });
  }


  listPaged(filter: RetentionFilter, page: Page<Retention>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.appendAll(filter.toURLSearchParams());
    return this.http.get(`${Endpoints.retentionUrl}/paged`,
      {
        search: params,
      })
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = Retention.fromListData(page.data);
        return page;
      });
  }

  listRetentionGroupPaged(page:Page<RetentionGroup>){
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    return this.http.get(`${Endpoints.retentionUrl}/retention-group/paged`,
      {
        search: params,
      })
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = RetentionGroup.fromListData(page.data);
        return page;
      });
  }

  find(id: number | string) {
    let url = `${Endpoints.retentionUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        let retention = Retention.fromData(response.json());
        return retention;
      });
  }

  save(retention: Retention): Promise<Retention> {
    if (retention.id) {
      return this.update(retention);
    } else {
      return this.create(retention);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.retentionUrl}/${id}`;
    return this.http.delete(url,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(() => null);
  }

  getRetentionSumNoBatch(id: number | string): Promise<number> {
    let url = `${Endpoints.retentionUrl}/sum-no-batch/${id}`;
    return this.http.get(url,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(( response => {
        let retentionSum = response.json();
        return retentionSum;
      }))
  }

  warrantReport(id: number | string, type: string):Promise<Blob> {
    let url = `${Endpoints.warrantReport}`;
    let params: URLSearchParams = new URLSearchParams();

    if(type){
      params.set('type',type);
    }

    return this.http
      .get(`${url}/${id}`, {
        headers: this.auth.appendOrCreateAuthHeader(this.headers),
        search: params,
        responseType: ResponseContentType.Blob
      })
      .toPromise()
      .then(response => {
        return response.blob();
      });
  }

  private create(retention: Retention): Promise<Retention> {
    return this.http
      .post(
        Endpoints.retentionUrl,
        retention,
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then(() => {});
  }

  private update(retention: Retention): Promise<Retention> {
    const url = `${Endpoints.retentionUrl}/${retention.id}`;
    return this.http
      .put(
        url,
        retention,
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then(() => retention);
  }

}
