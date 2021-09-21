import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { Person } from './person';
import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';


@Injectable()
export class PersonService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  list(): Promise<Array<Person>> {
    return this.http.get(Endpoints.PersonUrl)
                        .toPromise()
                        .then(response => {
                          return Person.fromListData(response.json());
                        });
  }


  listPaged(filter: any, page: Page<Person>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('filter', filter ? filter : '');
    return this.http.get(`${Endpoints.PersonUrl}/paged`,
                        {
                          search: params,
                        })
                        .toPromise()
                        .then(response => {
                          page.setResultFromServer(response.json());
                          page.data = Person.fromListData(page.data);
                          return page;
                        });
  }

  find(id: number | string) {

    let url = `${Endpoints.PersonUrl}/${id}`;
    return this.http.get(url)
               .toPromise()
               .then(response => {
                 let person = Person.fromData(response.json());
                 return person;
               });
  }

  save(person: Person): Promise<Person> {
    if (person.id) {
      return this.update(person);
    }else {
      return this.create(person);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.PersonUrl}/${id}`;
    return this.http.delete(url,
                            {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  private create(person: Person): Promise<Person> {

        return this.http
      .post(
        Endpoints.PersonUrl,
        person,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(res => {

        return Person.fromData(res.json());
      });
  }

  private update(person: Person): Promise<Person> {
    const url = `${Endpoints.PersonUrl}/${person.id}`;
    return this.http
      .put(
        url,
        person,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then((res) => Person.fromData(res.json()));
  }

}
