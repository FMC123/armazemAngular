import {EventEmitter, Injectable} from '@angular/core';
import { Http, Headers, URLSearchParams, ResponseContentType } from '@angular/http';
import { Endpoints } from './../endpoints';

import { Page } from './../shared/page/page';
import { AuthService } from './../auth/auth.service';
import { Batch } from './batch';
import { DailyMovementReportFilter } from 'app/report/daily-movement-report/daily-movement-report-filter';

@Injectable()
export class BatchService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  ownerId: string = '';
  warehouseId: string = '';

  constructor(
    private http: Http,
    private auth: AuthService
  ) { }

  listPaged(batchOperationId: string, page: Page<Batch>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    return this.http.get(`${Endpoints.batchUrl(batchOperationId)}/paged`,
      {
        search: params,
      })
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = Batch.fromListData(page.data);
        return page;
      });
  }

  listActiveFromShippingAuthorization(shippingAuthorizationId: string) {
    let params = new URLSearchParams();
    params.append('shippingAuthorizationId', shippingAuthorizationId);
    return this.http.get(
      Endpoints.batchRealtimeUrl(this.auth.accessToken.warehouse.id) + '/active-with-weight-available-shipping-authorization',
      { search: params },
    )
      .toPromise()
      .then(response => {
        return Batch.fromListData(response.json());
      });
  }

  listActive() {
    return this.http.get(
      Endpoints.batchRealtimeUrl(this.auth.accessToken.warehouse.id) + '/active-with-weight-available',
    )
      .toPromise()
      .then(response => {
        return Batch.fromListData(response.json());
      });
  }

  search(search: string) {
    let params = new URLSearchParams();
    params.append('limit', '10');
    params.append('search', search ? search : '');

    return this.http.get(
      Endpoints.batchRealtimeUrl(this.auth.accessToken.warehouse.id) + '/search',
      { search: params }
    )
      .toPromise()
      .then(response => {
        return Batch.fromListData(response.json());
      });
  }

  searchByOwner(search: string, ownerId:string) {
    let params = new URLSearchParams();
    params.append('limit', '10');
    params.append('search', search ? search : '');
    params.append('ownerId', ownerId ? ownerId : '');

    return this.http.get(
      Endpoints.batchRealtimeUrl(this.auth.accessToken.warehouse.id) + '/searchByOwner',
      { search: params }
    )
      .toPromise()
      .then(response => {
        return Batch.fromListData(response.json());
      });
  }

  list(batchOperationId: string) {
    return this.http.get(`${Endpoints.batchUrl(batchOperationId)}`)
      .toPromise()
      .then(response => {
        return Batch.fromListData(response.json());
      });
  }

  findByCode(code: string) {
    let codeEncoded = encodeURIComponent(code);
    let url = `${Endpoints.batchWarehouse(this.auth.accessToken.warehouse.id)}/code/${codeEncoded}`;
    return this.http.get(url)
    .toPromise()
      .then(response => {
        if (!response.text()) {
          return null;
        }

        return Batch.fromListData(response.json());
      });
  }

  findByCodeOrRefClient(code: string, refClient: string) {
    let params: URLSearchParams = new URLSearchParams();
    if(code){
      params.set('batchCode', code + '');
    }
    if(refClient){
      params.set('refClient', refClient + '');
    }
    let url = `${Endpoints.batchWarehouse(this.auth.accessToken.warehouse.id)}/list`;
     return this.http.get(url, {search: params})
       .toPromise()
       .then(response => {
          if (!response.text()) {
            return null;
          }

          return Batch.fromListData(response.json());
        });
  }

  find(batchOperationId: string, id: number | string) {
    let url = `${Endpoints.batchUrl(batchOperationId)}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => Batch.fromData(response.json()));
  }

  findByWarehouse(warehouseId: string) {
    let url = `${Endpoints.batchWarehouseUrl}/${warehouseId}`;
    return this.http.get(url)
      .toPromise()
      .then(response => Batch.fromListData(response.json()));
  }

  save(batch: Batch): Promise<Batch> {
    if (batch.id) {
      return this.update(batch);
    } else {
      return this.create(batch);
    }
  }

  delete(batchOperationId: string, id: number | string): Promise<void> {
    let url = `${Endpoints.batchUrl(batchOperationId)}/${id}`;
    return this.http.delete(url,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(() => null);
  }

  reopen(id: string): Promise<void> {
    let url = `${Endpoints.batchReopen(id)}`;
    return this.http.get(url,
      {headers:this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  private create(batch: Batch): Promise<Batch> {

    return this.http
      .post(Endpoints.batchUrl(batch.batchOperation.id), JSON.stringify(batch),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => Batch.fromData(res.json()));
  }

  private update(batch: Batch): Promise<Batch> {

    const url = `${Endpoints.batchUrl(batch.batchOperation.id)}/${batch.id}`;
    return this.http
      .put(url, JSON.stringify(batch),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => Batch.fromData(res.json()));
  }

  batchReceiveFinish(batch: Batch): Promise<Batch> {

    const url = `${Endpoints.batchReceiveFinishUrl(batch.batchOperation.id, batch.id)}`;
    return this.http
      .put(url, JSON.stringify(batch),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => Batch.fromData(res.json()));
  }

  recalculateList(batchOperationId: string) {
    return this.http.get(`${Endpoints.recalculateBatchUrl(batchOperationId)}`)
      .toPromise()
      .then(response => {
        return Batch.fromListData(response.json());
      });
  }

  /**
   * Lista com filtro sem paginação
   * @param filtro
   * @param localOnly
   */
  listFilter(filtro: Batch, localOnly: boolean = false) {
    let params = new URLSearchParams();
    params.append('localOnly', `${localOnly}`);
    return this.http
      .post(Endpoints.batchFilterUrl, JSON.stringify(filtro),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers),
                  search: params})
      .toPromise()
      .then(res => Batch.fromListData(res.json()));
  }

  /**
   * Relatório diário de movimentação em PDF
   *
   * @param filter
   */
  dailyMovementReport(filter: DailyMovementReportFilter): Promise<Blob> {
    let url = `${Endpoints.dailyMovementReportUrl}/pdf`;
    return this.http.post(url, JSON.stringify(filter), {
      headers: this.auth.appendOrCreateAuthHeader(this.headers),
      responseType: ResponseContentType.Blob
    }).toPromise().then(response => {
      return response.blob();
    });
  }

  updateBatchCode(batch: Batch): Promise<Batch> {
    return this.http
      .put(Endpoints.batchUpdateBatchCodeUrl, JSON.stringify(batch),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => Batch.fromData(res.json()));
  }

  loadBatchSwapData(batchId: string) {
    let url = `${Endpoints.batchSwapGetUrl}/${batchId}`;
    return this.http.get(url,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => res.json());

  }

  loadQtdReservedByType(batchId: string){
    let url = `${Endpoints.batchQtdReservedByType(batchId)}`;
    return this.http.get(url,
      {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      ).toPromise().then(res => res.json());
  }

}
