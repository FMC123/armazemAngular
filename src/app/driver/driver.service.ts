import {Injectable} from '@angular/core';
import {Headers, Http, URLSearchParams} from '@angular/http';

import {Endpoints} from '../endpoints';
import {AuthService} from '../auth/auth.service';
import {Page} from '../shared/page/page';
import {Driver} from "./driver";
import {Warehouse} from "../warehouse/warehouse";


@Injectable()
export class DriverService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  search(search: any) {
    let params = new URLSearchParams();
    params.append('search', search ? search : '');
    return this.http.get(
      `${Endpoints.driverUrl}`,
      { search: params }
    )
      .toPromise()
      .then(response => {
        if (!response.text()) {
          return [];
        }
        return response.json();
      });
  }

  listDriverAutocomplete(search?: string): Promise<Array<Driver>> {
    let params = new URLSearchParams();
    params.append('search', search ? search : '');
    params.append('limit', '10');

    return this.http.get(
      `${Endpoints.driverUrl}/search`,
      {search: params},
    )
      .toPromise()
      .then(response => {
        return Driver.fromListData(response.json());
      });
  }

  list(): Promise<Array<Driver>> {
    return this.http.get(Endpoints.DriverURL)
      .toPromise()
      .then(response => {
        return Driver.fromListData(response.json());
      });
  }


  listPaged(filter: any, page: Page<Driver>) {

    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('filter', filter ? filter : '');
    return this.http.get(`${Endpoints.DriverURL}/paged`,
      {
        search: params,
      })
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = Driver.fromListData(page.data);
        return page;
      });
  }

  find(id: number | string) {
    let url = `${Endpoints.DriverURL}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        return Driver.fromData(response.json());
      });
  }

  save(driver: Driver): Promise<Driver> {
    if (driver.id) {
      return this.update(driver);
    }else {
      return this.create(driver);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.DriverURL}/${id}`;
    return this.http.delete(url,
      {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  private create(driver: Driver): Promise<Driver> {
    const url = `${Endpoints.DriverURL}`

    return this.http
      .post(url, driver,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json());
  }

  private update(driver: Driver): Promise<Driver> {
    const url = `${Endpoints.DriverURL}/${driver.id}`;
    return this.http
      .put(url,
        driver,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => driver);
  }
}
