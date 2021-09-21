import { Drink } from './drink';
import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';
import {toPromise} from "rxjs/operator/toPromise";

@Injectable()
export class DrinkService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  list(): Promise<Array<Drink>> {
    return this.http.get(Endpoints.drinkURL)
                        .toPromise()
                        .then(response => {
                          return Drink.fromListData(response.json());
                        });
  }


  listPaged(filter: any, page: Page<Drink>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('search', filter ? filter : '');
    return this.http.get(`${Endpoints.drinkURL}/paged`,
                        {
                          search: params,
                        })
                        .toPromise()
                        .then(response => {
                          page.setResultFromServer(response.json());
                          page.data = Drink.fromListData(page.data);
                          return page;
                        });
  }

  find(id: number | string) {
    let url = `${Endpoints.drinkURL}/${id}`;
    return this.http.get(url)
               .toPromise()
               .then(response => {
                 let drink = Drink.fromData(response.json());

                 return drink;
               });
  }

  save(drink: Drink): Promise<Drink> {
    if (drink.id) {
      return this.update(drink);
    }else {
      return this.create(drink);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.drinkURL}/${id}`;
    return this.http.delete(url,
    {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  private create(drink: Drink): Promise<Drink> {
    const url = `${Endpoints.drinkURL}`

    return this.http
      .post(url, JSON.stringify(drink),
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json());
  }

  private update(drink: Drink): Promise<Drink> {
    const url = `${Endpoints.drinkURL}/${drink.id}`;
    return this.http
      .put(url, drink, {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => Drink);
  }
}
