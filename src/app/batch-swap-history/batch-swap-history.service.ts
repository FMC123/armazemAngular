import {Page} from '../shared/page/page';
import {Injectable} from '@angular/core';
import {
  Headers,
  Http,
  URLSearchParams
} from '@angular/http';

import {AuthService} from '../auth/auth.service';
import {Endpoints} from '../endpoints';
import {BatchSwapHistoryFilter} from "./batch-swap-history-list/batch-swap-history-filter";
import {BatchSwapHistory} from "./batch-swap-history";

@Injectable()
export class BatchSwapHistoryService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http, private auth: AuthService) {
  }

  listPaged(filter: BatchSwapHistoryFilter, page: Page<BatchSwapHistory>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.appendAll(filter.toURLSearchParams());
    return this.http
      .get(`${Endpoints.batchSwapUrl}/paged`, {search: params})
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = BatchSwapHistory.fromListData(page.data);
        return page;
      });
  }

  find(id: string) {
    let url = `${Endpoints.batchSwapUrl}/${id}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => BatchSwapHistory.fromData(response.json()));
  }

  update(BatchSwapHistory: Array<BatchSwapHistory>): Promise<void> {
    const url = `${Endpoints.batchSwapUrl}`;
    return this.http
      .put(url, JSON.stringify(BatchSwapHistory), {
        headers: this.auth.appendOrCreateAuthHeader(this.headers)
      })
      .toPromise()
      .then(() => {
      });
  }

  delete(id: string): Promise<void> {
    let url = `${Endpoints.batchSwapUrl}/${id}`;
    return this.http
      .delete(url, {
        headers: this.auth.appendOrCreateAuthHeader(this.headers)
      })
      .toPromise()
      .then(() => null);
  }

  BatchSwapHistoryPermissions() {
    return this.http
      .get(Endpoints.userMenusURL)
      .toPromise();
  }
}
