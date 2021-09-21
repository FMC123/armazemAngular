import { AuthService } from './../auth/auth.service';
import { Endpoints } from './../endpoints';
import { Page } from './../shared/page/page';
import { ShippingAuthorization } from './shipping-authorization';
import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { debug } from 'util';
import { ShippingAuthorizationFilter } from './shipping-authorization-list/shipping-authorization-filter';

@Injectable()
export class ShippingAuthorizationService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http: Http,
    private auth: AuthService,
  ) {}

  listPaged(filter: ShippingAuthorizationFilter, page: Page<ShippingAuthorization>) {
    let params = new URLSearchParams();

    if (filter) {
      params.appendAll(filter.toURLSearchParams());
    }

    params.appendAll(page.toURLSearchParams());
    return this.http.get(
      `${Endpoints.shippingAuthorizationUrl}/paged`,
      { search: params }
    )
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = ShippingAuthorization.fromListData(page.data);
        return page;
      });
  }

  list(): Promise<Array<ShippingAuthorization>> {
    return this.http.get(Endpoints.shippingAuthorizationUrl)
      .toPromise()
      .then(response => {
        return ShippingAuthorization.fromListData(response.json());
      });
  }

  find(id: number | string) {
    let url = `${Endpoints.shippingAuthorizationUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        let shippingAuthorization = ShippingAuthorization.fromData(response.json());
        return shippingAuthorization;
    });
  }

  save(shippingAuthorization: ShippingAuthorization): Promise<ShippingAuthorization> {
    if (shippingAuthorization.id) {
      return this.update(shippingAuthorization);
    }else {
      return this.create(shippingAuthorization);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.shippingAuthorizationUrl}/${id}`;
    return this.http.delete(
        url,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(() => null);
  }

  close(id: number | string): Promise<void> {
    let url = `${Endpoints.shippingAuthorizationUrl}/${id}/close`;
    return this.http.put(
        url,
        null,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(() => null);
  }

  private create(shippingAuthorization: ShippingAuthorization): Promise<ShippingAuthorization> {
    return this.http
      .post(
        Endpoints.shippingAuthorizationUrl,
        shippingAuthorization,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(res => ShippingAuthorization.fromData(res.json()));
  }

  private update(shippingAuthorization: ShippingAuthorization): Promise<ShippingAuthorization> {
    const url = `${Endpoints.shippingAuthorizationUrl}/${shippingAuthorization.id}`;
    return this.http
      .put(
        url,
        shippingAuthorization,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(() => shippingAuthorization);
  }
}
