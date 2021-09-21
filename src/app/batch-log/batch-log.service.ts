import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { BatchLog } from './../batch-log/batch-log';
import { Endpoints } from './../endpoints';
import { Page } from './../shared/page/page';
import { BatchLogFilter } from './batch-log-filter';

@Injectable()
export class BatchLogService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {}

  listPaged(filter: BatchLogFilter, page: Page<BatchLog>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.appendAll(filter.toURLSearchParams());
    return this.http
      .get(
        `${Endpoints.logBatchUrl}/paged`,
        { search: params }
      )
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = BatchLog.fromListData(page.data);
        return page;
      });
  }

  find(id: number | string) {
    let url = `${Endpoints.logBatchUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        return BatchLog.fromData(response.json());
      });
  }
}
