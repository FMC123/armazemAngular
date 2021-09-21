import { AuthService } from './../auth/auth.service';
import { Endpoints } from './../endpoints';
import { Page } from './../shared/page/page';
import { PackType } from './pack-type';
import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';

@Injectable()
export class PackTypeService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http: Http,
    private auth: AuthService,
  ) {}

  listPaged(filter: any, page: Page<PackType>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('search', filter ? filter : '');
    return this.http.get(
      `${Endpoints.packTypeUrl}/paged`,
      { search: params }
    )
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = PackType.fromListData(page.data);
        return page;
      });
  }

  list(typeList: Array<string> = null): Promise<Array<PackType>> {
    let params = new URLSearchParams();
    if(typeList){
      typeList.forEach( type => params.append('filter', type));
    }
    return this.http.get(Endpoints.packTypeUrl, { search: params})
      .toPromise()
      .then(response => {
        return PackType.fromListData(response.json());
      });
  }

  listByGenericType(genericType: string): Promise<Array<PackType>> {
    return this.http.get(`${Endpoints.packTypeUrl}/generic-type/${genericType}`)
      .toPromise()
      .then(response => {
        return PackType.fromListData(response.json());
      });
  }

  listForDiscount(): Promise<Array<PackType>> {
    return this.http.get(`${Endpoints.packTypeUrl}/discount`)
      .toPromise()
      .then(response => {
      return PackType.fromListData(response.json());
    });
  }

  find(id: number | string) {
    let url = `${Endpoints.packTypeUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        let packType = PackType.fromData(response.json());
        return packType;
    });
  }

  save(packType: PackType): Promise<PackType> {
    if (packType.id) {
      return this.update(packType);
    }else {
      return this.create(packType);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.packTypeUrl}/${id}`;
    return this.http.delete(
        url,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(() => null);
  }

  private create(packType: PackType): Promise<PackType> {
    return this.http
      .post(
        Endpoints.packTypeUrl,
        packType,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(res => res.json().data);
  }

  private update(packType: PackType): Promise<PackType> {
    const url = `${Endpoints.packTypeUrl}/${packType.id}`;
    return this.http
      .put(
        url,
        packType,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(() => packType);
  }
}
