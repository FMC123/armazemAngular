import { StorageUnitBatchLog } from './storage-unit-batch-log';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams, ResponseContentType } from '@angular/http';

import { Endpoints } from '../endpoints';
import { Page } from '../shared/page/page';
import { AuthService } from '../auth/auth.service';
import { StorageUnitBatchLogFilter } from 'app/storage-unit-batch-log/storage-unit-batch-log-list/storage-unit-batch-log-filter';
import { StorageUnitLog } from './storage-unit-log';
import {AuditInventoryReport} from "../report/audit-inventory-report/audit-inventory-report";

@Injectable()
export class StorageUnitBatchLogService {
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    private http: Http,
    private auth: AuthService
  ) { }

  listPaged(filter: StorageUnitBatchLogFilter, page: Page<StorageUnitBatchLog>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());

    if (filter) {
      params.appendAll(filter.toURLSearchParams());
    }

    return this.http.get(`${Endpoints.storageUniBatchLogtUrl}/paged`,
      { search: params })
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = StorageUnitBatchLog.fromListData(page.data);
        return page;
      });
  }

  find(id: number | string) {
    let url = `${Endpoints.storageUniBatchLogtUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        let storageUnitBatchLog = StorageUnitBatchLog.fromData(response.json());
        return storageUnitBatchLog;
      });
  }

  /**
   * Relatório em PDF (byte)
   * @param filter
   */
  relatorioHistoricoMovimentacao(filter: StorageUnitBatchLogFilter, sort: string): Promise<Blob> {

    let arrMap = Array.from(filter.toURLSearchParams().paramsMap);

    let obj = {};
    for (let [k, v] of arrMap) {
      obj[k] = v[0];
    }

    // adiciona a ordenação
    obj['orderBy'] = sort;

    let url = `${Endpoints.storageUniBatchLogReport}`;
    return this.http.post(url, JSON.stringify(obj), {
      headers: this.auth.appendOrCreateAuthHeader(this.headers),
      responseType: ResponseContentType.Blob
    }
    )
      .toPromise()
      .then(response => {
        return response.blob();
      });
  }

  /**
   * * Relatório em listagem para CSV
   * @param filter
   */
  relatorioHistoricoMovimentacaoList(filter: StorageUnitBatchLogFilter, sort: string): Promise<Array<StorageUnitBatchLog>> {

    let arrMap = Array.from(filter.toURLSearchParams().paramsMap);

    let obj = {};
    for (let [k, v] of arrMap) {
      obj[k] = v[0];
    }

    // adiciona a ordenação
    obj['orderBy'] = sort;

    let url = `${Endpoints.storageUniBatchLogListReport}`;
    return this.http.post(url, JSON.stringify(obj), {
      headers: this.auth.appendOrCreateAuthHeader(this.headers),
      responseType: ResponseContentType.Json
    })
      .toPromise()
      .then(response => {
        return StorageUnitBatchLog.fromListData(response.json());
      });
  }


  /**
   * * Lista de entradas do batch
   * @param filter
   */
  batchEntriesList(batchId: string): Promise<Array<StorageUnitBatchLog>> {

    let url = `${Endpoints.storageUniBatchLogtUrl}` + '/entries/' + batchId;

    return this.http.get(url, {
      headers: this.auth.appendOrCreateAuthHeader(this.headers),
      responseType: ResponseContentType.Json
    })
      .toPromise()
      .then(response => {
        return StorageUnitBatchLog.fromListData(response.json());
      });
  }
}
