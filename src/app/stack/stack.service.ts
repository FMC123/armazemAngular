import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Endpoints } from './../endpoints';
import { Page } from './../shared/page/page';
import { AuthService } from './../auth/auth.service';

import {Stack} from "./stack";

@Injectable()
export class StackService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}


  listPaged(positionId: string, filter: any, page: Page<Stack>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('search', filter ? filter : '');
    return this.http.get(`${Endpoints.stackUrl}/byPosition/${positionId}/paged`,
      {
        search: params,
      })
      .toPromise()
      .then(response => {
          page.setResultFromServer(response.json());
        page.data = Stack.fromListData(page.data);
        return page;
      });
  }

  list(positionId: string) {
    return this.http.get(`${Endpoints.stackUrl}/byPosition/${positionId}`)
      .toPromise()
      .then(response => {
        return Stack.fromListData(response.json());
      });
  }

  find(stackId: number | string) {
    let url = `${Endpoints.stackUrl}/${stackId}`;
    return this.http.get(url)
      .toPromise()
      .then(response => Stack.fromData(response.json()));
  }

  save(stack: Stack): Promise<Stack> {
    if (stack.id) {
      return this.update(stack);
    }else {
      return this.create(stack);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.stackUrl}/${id}`;
    return this.http.delete(url,
      {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  private create(stack: Stack): Promise<Stack> {
    return this.http
      .post(Endpoints.stackUrl ,JSON.stringify(stack),
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => Stack.fromData(res.json()));
  }

  private update(stack: Stack): Promise<Stack> {
    const url = `${Endpoints.stackUrl}/${stack.id}`;
    return this.http
      .put(url, JSON.stringify(stack),
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => Stack.fromData(res.json()));
  }
}
