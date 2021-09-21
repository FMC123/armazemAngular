import { Page } from '../shared/page/page';
import { AuthService } from '../auth/auth.service';
import { Endpoints } from '../endpoints';
import { StorageUnit } from './storage-unit';
import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { StorageUnitBatch } from './storage-unit-batch';

@Injectable()
export class StorageUnitService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http: Http,
    private auth: AuthService,
  ) {}

  listPaged(batchId: string, filter: any, page: Page<StorageUnit>) {
    let params = new URLSearchParams();
    params.append('batchId', batchId);
    return this.http.get(`${Endpoints.storageUnitUrl}/web/paged`,
      {
        search: params,
      })
      .toPromise()
      .then(response => {
          page.setResultFromServer(response.json());
        page.data = StorageUnit.fromListData(page.data);
        return page;
      });
  }

  find(storageUnitId: number | string) {
    let url = `${Endpoints.storageUnitUrl}/${storageUnitId}`;
    return this.http.get(url)
      .toPromise()
      .then(response => StorageUnit.fromData(response.json()));
  }

  findWithBatches(storageUnitId: number | string) {
    const params = new URLSearchParams();
    params.append('fillWithBatches', 'true');
    let url = `${Endpoints.storageUnitUrl}/${storageUnitId}`;
    return this.http.get(
      url,
      { search: params }
    )
      .toPromise()
      .then(response => StorageUnit.fromData(response.json()));
  }

  listByBatch(batchId: number | string) {
    let url = `${Endpoints.storageUnitUrl}/web/batch/${batchId}`;
    return this.http.get(url)
      .toPromise()
      .then(response => StorageUnit.fromListData(response.json()));
  }

  listHistoryByBatch(batchId: number | string) {
    let url = `${Endpoints.storageUnitUrl}/web/batch/${batchId}/history`;
    return this.http.get(url)
      .toPromise()
      .then(response => StorageUnit.fromListData(response.json()));
  }

  save(storageUnit: StorageUnit): Promise<StorageUnit> {
    if (storageUnit.id) {
      return this.update(storageUnit);
    } else {
      return this.create(storageUnit);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.storageUnitUrl}/web/${id}`;
    return this.http.delete(url,
      {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  move(storageUnit: StorageUnit): Promise<StorageUnit> {
    const url = `${Endpoints.storageUnitUrl}/web/${storageUnit.id}/move`;
    return this.http
      .put(url, JSON.stringify(storageUnit),
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => null);
  }

  merge(batchId: string, fromId: string, toId: string) {
    const params = new URLSearchParams();
    params.append('batchId', batchId);
    params.append('fromId', fromId);
    params.append('toId', toId);
    const url = `${Endpoints.storageUnitUrl}/merge`;

    return this.http
      .put(
        url,
        null,
        {
          search: params,
          headers: this.auth.appendOrCreateAuthHeader(this.headers)
        }
      )
      .toPromise()
      .then(res => null);
  }

  saveSacaria(storageUnitBatch: StorageUnitBatch): Promise<StorageUnitBatch> {
    const url = `${Endpoints.storageUnitUrl}/web/sacaria`;
    return this.http
      .put(url, JSON.stringify(storageUnitBatch),
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => null);
  }

  private create(storageUnit: StorageUnit): Promise<StorageUnit> {
    return this.http
      .post(`${Endpoints.storageUnitUrl}/web`, JSON.stringify(storageUnit),
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => null);
  }

  private update(storageUnit: StorageUnit): Promise<StorageUnit> {
    const url = `${Endpoints.storageUnitUrl}/web/${storageUnit.id}`;
    return this.http
      .put(url, JSON.stringify(storageUnit),
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => null);
  }

}
