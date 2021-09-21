import { Page } from '../../shared/page/page';
import { AuthService } from './../../auth/auth.service';
import { Endpoints } from './../../endpoints';
import { StorageUnitOut } from './storage-unit-out';
import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';

@Injectable()
export class StorageUnitOutService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http: Http,
    private auth: AuthService,
  ) {}

  listByBatch(batchId: string) {
    let url = `${Endpoints.storageUnitOutUrl}/batch/${batchId}`;
    return this.http.get(url)
      .toPromise()
      .then(response => StorageUnitOut.fromListData(response.json()));
  }

  find(id: number | string) {
    let url = `${Endpoints.storageUnitOutUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => StorageUnitOut.fromData(response.json()));
  }

  save(storageUnitOut: StorageUnitOut): Promise<StorageUnitOut> {
    if (storageUnitOut.id) {
      return this.update(storageUnitOut);
    }else {
      return this.create(storageUnitOut);
    }
  }

  delete(storageUnitOut: StorageUnitOut): Promise<void> {
    const params = new URLSearchParams();
    params.append('delete', 'true');
    const url = `${Endpoints.storageUnitOutUrl}/web/${storageUnitOut.id}`;
    return this.http
      .put(
        url,
        JSON.stringify(storageUnitOut),
        {
          headers: this.auth.appendOrCreateAuthHeader(this.headers),
          search: params,
        })
      .toPromise()
      .then(res => null);
  }

  private create(storageUnitOut: StorageUnitOut): Promise<StorageUnitOut> {
    return this.http
      .post(`${Endpoints.storageUnitOutUrl}/web`, JSON.stringify(storageUnitOut),
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => null);
  }

  private update(storageUnitOut: StorageUnitOut): Promise<StorageUnitOut> {
    const url = `${Endpoints.storageUnitOutUrl}/web/${storageUnitOut.id}`;
    return this.http
      .put(url, JSON.stringify(storageUnitOut),
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => null);
  }

}
