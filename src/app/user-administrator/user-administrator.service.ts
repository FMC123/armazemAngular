import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { Endpoints } from './../endpoints';
import { User } from './../user/user';
import { Page } from './../shared/page/page';
import { AuthService } from './../auth/auth.service';

@Injectable()
export class UserAdministratorService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  listPaged(filter: any, page: Page<User>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('search', filter ? filter : '');
    return this.http.get(`${Endpoints.userUrl}/admin/paged`,
                        {
                          search: params,
                        })
                        .toPromise()
                        .then(response => {
                          page.setResultFromServer(response.json());
                          page.data = User.fromListData(page.data);
                          return page;
                        });
  }

  list(): Promise<Array<User>> {
    return this.http.get(Endpoints.userUrl)
                        .toPromise()
                        .then(response => {
                          return User.fromListData(response.json());
                        });
  }

  find(id: number | string) {
    let url = `${Endpoints.userUrl}/admin/${id}`;
    return this.http.get(url)
               .toPromise()
               .then(response => {
                 let user = User.fromData(response.json());
                 return user;
              });
  }

  save(user: User): Promise<User> {
    if (user.id) {
      return this.update(user);
    }else {
      return this.create(user);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.userUrl}/${id}`;
    return this.http.delete(url,
                            {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  loginExists(id: string, login: string) {
    let params = new URLSearchParams();
    params.append('login', login);
    let url = `${Endpoints.userValidationLoginUrl}${id ? '/'+id : ''}`;
    return new Promise((resolve, reject) => {
      this.http.get(url,
                        {
                          search: params,
                        })
                        .toPromise()
                        .then(() => resolve(false))
                        .catch((error) => {
                          if (error.status === 400) {
                            resolve(true);
                          }
                          reject(error);
                        });
    });
  }

  private create(user: User): Promise<User> {
    return this.http
      .post(
        Endpoints.userUrl + '/admin',
        user,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(res => null);
  }

  private update(user: User): Promise<User> {
    const url = `${Endpoints.userUrl}/admin/${user.id}`;
    return this.http
      .put(
        url,
        user,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(() => null);
  }
}
