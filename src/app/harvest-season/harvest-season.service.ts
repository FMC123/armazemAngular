import { HarvestSeason } from './harvest-season';
import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';
import {toPromise} from "rxjs/operator/toPromise";

@Injectable()
export class HarvestSeasonService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  list(): Promise<Array<HarvestSeason>> {
    return this.http.get(Endpoints.harvestSeasonURL)
                        .toPromise()
                        .then(response => {
                          return HarvestSeason.fromListData(response.json());
                        });
  }


  listPaged(filter: any, page: Page<HarvestSeason>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('filter', filter ? filter : '');
    return this.http.get(`${Endpoints.harvestSeasonURL}/paged`,
                        {
                          search: params,
                        })
                        .toPromise()
                        .then(response => {
                          page.setResultFromServer(response.json());
                          page.data = HarvestSeason.fromListData(page.data);
                          return page;
                        });
  }

  find(id: number | string) {
    let url = `${Endpoints.harvestSeasonURL}/${id}`;
    return this.http.get(url)
               .toPromise()
               .then(response => {
                 let harvestSeason = HarvestSeason.fromData(response.json());

                 return harvestSeason;
               });
  }

  save(harvestSeason: HarvestSeason): Promise<HarvestSeason> {
    if (harvestSeason.id) {
      return this.update(harvestSeason);
    }else {
      return this.create(harvestSeason);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.harvestSeasonURL}/${id}`;
    return this.http.delete(url,
    {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  private create(harvestSeason: HarvestSeason): Promise<HarvestSeason> {
    const url = `${Endpoints.harvestSeasonURL}`

    return this.http
      .post(url, JSON.stringify(harvestSeason),
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json());
  }

  private update(harvestSeason: HarvestSeason): Promise<HarvestSeason> {
    const url = `${Endpoints.harvestSeasonURL}/${harvestSeason.id}`;
    return this.http
      .put(url, harvestSeason, {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => HarvestSeason);
  }
}
