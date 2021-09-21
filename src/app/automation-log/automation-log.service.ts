import { Endpoints } from '../endpoints';
import { Page } from '../shared/page/page';
import { AutomationLog } from './automation-log';
import { AuthService } from '../auth/auth.service';
import { Injectable } from '@angular/core';
import { Headers, Http, Response, URLSearchParams } from '@angular/http';

@Injectable()
export class AutomationLogService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http: Http,
    private auth: AuthService
  ) { }

  listPaged(filter: any, page: Page<AutomationLog>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('search', filter ? filter : '');
    return this.http.get(
      `${Endpoints.automationLogUrl}/paged`,
      {
        search: params,
      }
    )
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = AutomationLog.fromListData(page.data);
        return page;
      });
  }
}
