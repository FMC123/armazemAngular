import { Company } from './company';
import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';
import {toPromise} from "rxjs/operator/toPromise";

@Injectable()
export class CompanyService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  list(): Promise<Array<Company>> {
    return this.http.get(Endpoints.companyURL)
                        .toPromise()
                        .then(response => {
                          return Company.fromListData(response.json());
                        });
  }


  listPaged(filter: any, page: Page<Company>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('filter', filter ? filter : '');
    return this.http.get(`${Endpoints.companyURL}/paged`,
                        {
                          search: params,
                        })
                        .toPromise()
                        .then(response => {
                          page.setResultFromServer(response.json());
                          page.data = Company.fromListData(page.data);
                          return page;
                        });
  }

  find(id: number | string) {
    let url = `${Endpoints.companyURL}/${id}`;
    return this.http.get(url)
               .toPromise()
               .then(response => {
                 let company = Company.fromData(response.json());

                 return company;
               });
  }

  save(company: Company): Promise<Company> {
    if (company.id) {
      return this.update(company);
    }else {
      return this.create(company);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.companyURL}/${id}`;
    return this.http.delete(url,
    {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  private create(company: Company): Promise<Company> {
    const url = `${Endpoints.companyURL}`;

    return this.http
      .post(url, JSON.stringify(company),
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json());
  }

  private update(company: Company): Promise<Company> {
    const url = `${Endpoints.companyURL}/${company.id}`;
    return this.http
      .put(url, company, {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => Company);
  }
}
