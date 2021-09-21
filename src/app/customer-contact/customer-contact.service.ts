import { Injectable } from '@angular/core';
import { Endpoints } from './../endpoints';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';
import { CustomerContact } from './customer-contact';

@Injectable()
export class CustomerContactService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  list(person: string){
      return this.http.get(`${Endpoints.customerContactUrl(person)}`)
                      .toPromise()
                      .then(response => {
                        return CustomerContact.fromListData(response.json());
                      });
  }

  listPaged(person: string, page: Page<CustomerContact>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    return this.http.get(`${Endpoints.customerContactUrl(person)}/paged`,
                        {
                          search: params,
                        })
                        .toPromise()
                        .then(response => {
                          page.setResultFromServer(response.json());
                          page.data = CustomerContact.fromListData(page.data);
                          return page;
                        });
  }

  findOne(person:string, id: number | string) {
    let url = `${Endpoints.customerContactUrl(person)}/${id}`;
    return this.http.get(url)
               .toPromise()
               .then(response => {
                 let customercontact = CustomerContact.fromData(response.json());
                 return customercontact;
               });
  }

  save(customerContact: CustomerContact): Promise<CustomerContact> {
    if (customerContact.id) {
      return this.update(customerContact);
    }else {
      return this.create(customerContact);
    }
  }

  private create(customerContact: CustomerContact): Promise<CustomerContact> {
    return this.http
      .post(Endpoints.customerContactUrl(customerContact.person.id),
           JSON.stringify(customerContact),
          {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json().data);
  }

    delete(person: string, id: number | string): Promise<void> {
    let url = `${Endpoints.customerContactUrl(person)}/${id}`;
    return this.http.delete(url,
    {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  private update(customerContact: CustomerContact): Promise<CustomerContact> {
    const url = `${Endpoints.customerContactUrl(customerContact.person.id)}/${customerContact.id}`;
    return this.http
      .put(url,
        JSON.stringify(customerContact),
          {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => CustomerContact.fromData(res.json()));
  }
}
