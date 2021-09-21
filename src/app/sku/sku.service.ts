import {Injectable} from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';

import {Endpoints} from '../endpoints';
import {Page} from '../shared/page/page';
import {SkuFilter} from './sku-filter';
import {AuthService} from '../auth/auth.service';
import {Sku} from "./sku";
import {Collaborator} from "../collaborator/collaborator";
import {ErrorHandler} from "../shared/shared.module";

@Injectable()
export class SkuService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService,
              private errorHandler: ErrorHandler) {
  }

  list(search?: string, exclude?:string): Promise<Array<Sku>> {
    let params = new URLSearchParams();
    params.append('limit', '10');
    params.append('search', search ? search : '');
    params.append('exclude', exclude ? exclude : '');

    return this.http.get(
      `${Endpoints.skuUrl}/filter`,
      {search: params})
      .toPromise()
      .then(response => {
        return Sku.fromListData(response.json());
      })
      .catch(error => {
        this.handleError(error);
      });
  }

  listPaged(filter: any, page: Page<Sku>): Promise<Page<Sku>> {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('search', filter ? filter : '');
    return this.http
      .get(
        `${Endpoints.skuUrl}/paged`,
        {search: params}
      )
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = Sku.fromListData(page.data);
        return page;
      })
      .catch(error => {
        return this.handleError(error);
      });
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.skuUrl}/${id}`;
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

  create(sku: Sku, send: boolean): Promise<Sku> {
    const url = `${Endpoints.skuUrl}`;
    let params = new URLSearchParams();
    params.append('send', '' + send);

    return this.http
      .post(url, JSON.stringify(sku), {
        headers: this.auth.appendOrCreateAuthHeader(this.headers),
        search: params
      })
      .toPromise()
      .then(res => res.json())
      .catch(error => {
        return this.handleError(error);
      });
  }

  update(sku: Sku): Promise<Sku> {
    const url = `${Endpoints.skuUrl}/${sku.id}`;
    return this.http
      .put(url, sku, {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => sku)
      .catch(error => {
        return this.handleError(error);
      });
  }

  find(id: number | string): Promise<Sku> {
    const url = `${Endpoints.skuUrl}/${id}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => {
        let sku = Sku.fromData(response.json());
        return sku;
      })
      .catch(error => {
        return this.handleError(error);
      });
  }

  hasChildren(id: number | string): Promise<boolean> {
    const url = `${Endpoints.skuUrl}/${id}/hasChildren`;
    return this.http
      .get(url)
      .toPromise().then( (response:any) =>{
        return response._body === 'true';
      })
      .catch(error => {
        return this.handleError(error);
      });
  }

  private handleError(error) {
    return this.errorHandler.fromServer(error);
  }
}
