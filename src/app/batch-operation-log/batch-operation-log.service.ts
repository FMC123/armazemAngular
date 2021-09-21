import { BatchOperationLog } from './batch-operation-log';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { BatchLog } from './../batch-log/batch-log';
import { Endpoints } from './../endpoints';
import { Page } from './../shared/page/page';
import { BatchOperationFilter } from '../batch-operation/batch-operation-list/batch-operation-filter';
/* import { AuthService } from './../auth/auth.service'; */

@Injectable()
export class BatchOperationLogService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              /* private auth: AuthService */
            ) {}

  listPaged(filter: BatchOperationFilter, page: Page<BatchOperationLog>) {

    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.appendAll(filter.toURLSearchParams());
    return this.http
      .get(
        `${Endpoints.logBatchOperationUrl}/paged`,
        { search: params }
      )
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = BatchOperationLog.fromListData(page.data);
        return page;
      });
  }

  find(id: number | string) {
    let url = `${Endpoints.logBatchOperationUrl}/${id}`;
    return this.http.get(url)
               .toPromise()
               .then(response => {
                 let batchOperationLog = BatchOperationLog.fromData(response.json());

                 return batchOperationLog;
               });
  }

 /*  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.batchLogUrl}/${id}`;
    return this.http
      .delete(
        url,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(() => null);
  } */
}
