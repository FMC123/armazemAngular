import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import {PositionLayer} from './position-layer';
import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';
import {toPromise} from "rxjs/operator/toPromise";


@Injectable()
export class PositionLayerService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  list(): Promise<Array<PositionLayer>> {
    return this.http.get(Endpoints.positionLayerURL)
                        .toPromise()
                        .then(response => {
                          return PositionLayer.fromListData(response.json());
                        });
  }


  listPaged(filter: any, page: Page<PositionLayer>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('search', filter ? filter : '');
    return this.http.get(`${Endpoints.positionLayerURL}/paged`,
                        {
                          search: params,
                        })
                        .toPromise()
                        .then(response => {
                          page.setResultFromServer(response.json());
                          page.data = PositionLayer.fromListData(page.data);
                          return page;
                        });
  }

  find(id: number | string) {
    let url = `${Endpoints.positionLayerURL}/${id}`;
    return this.http.get(url)
               .toPromise()
               .then(response => {
                 let positionLayer = PositionLayer.fromData(response.json());

                 return positionLayer;
               });
  }

  save(positionLayer: PositionLayer): Promise<PositionLayer> {
    if (positionLayer.id) {
      return this.update(positionLayer);
    }else {
      return this.create(positionLayer);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.positionLayerURL}/${id}`;
    return this.http.delete(url,
                            {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  private create(positionLayer: PositionLayer): Promise<PositionLayer> {
    const url = `${Endpoints.positionLayerURL}`
    return this.http
      .post(url, JSON.stringify(positionLayer),
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json());
  }

  private update(positionLayer: PositionLayer): Promise<PositionLayer> {
    const url = `${Endpoints.positionLayerURL}/${positionLayer.id}`;
    return this.http
      .put(url,
           positionLayer
      ,
          {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => positionLayer);
  }
}
