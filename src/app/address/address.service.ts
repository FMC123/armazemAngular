import { Address } from './address';
import { TypeAddress } from './type-address';
import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';
import { toPromise } from 'rxjs/operator/toPromise';


@Injectable()
export class AddressService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  list(person: string) {
    return this.http.get(`${Endpoints.addressUrl(person)}`)
                        .toPromise()
                        .then(response => {
                          return Address.fromListData(response.json());
                        });
  }


  listPaged(person: string, page: Page<Address>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    return this.http.get(`${Endpoints.addressUrl(person)}/paged`,
                        {
                          search: params,
                        })
                        .toPromise()
                        .then(response => {
                          page.setResultFromServer(response.json());
                          page.data = Address.fromListData(page.data);
                          return page;
                        });
  }


  findOne(person: string, id: number | string) {
   let url = `${Endpoints.addressUrl(person)}/${id}`;
    return this.http.get(url)
               .toPromise()
               .then(response => {
                 let address = Address.fromData(response.json());

                 return address;
               });
  }

  save(address: Address): Promise<Address> {
    if (address.id) {
      return this.update(address);
    }else {
      return this.create(address);
    }
  }


    delete(person: string, id: number | string): Promise<void> {
    let url = `${Endpoints.addressUrl(person)}/${id}`;
    return this.http.delete(url,
    {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }


  private create(address: Address): Promise<Address> {
    return this.http
      .post(Endpoints.addressUrl(address.person.id), JSON.stringify(address),
          {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => Address.fromData(res.json()));
  }

  private update(address: Address): Promise<Address> {
    const url = `${Endpoints.addressUrl(address.person.id)}/${address.id}`;
    return this.http
      .put(url, JSON.stringify(address),
          {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => Address.fromData(res.json()));
  }

}
