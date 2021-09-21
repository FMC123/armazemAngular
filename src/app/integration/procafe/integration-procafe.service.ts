import {Headers, Http, URLSearchParams} from "@angular/http";
import {Injectable} from "@angular/core";
import {Page} from "../../shared/page/page";
import {AuthService} from "../../auth/auth.service";
import {Endpoints} from "../../endpoints";
import {IntegrationLogFilter} from "../base-integration/integration-log/integration-log.filter";
import {IntegrationLog} from "../base-integration/integration-log/integration-log";
import {IntegrationProcafe} from "./integration-procafe";

@Injectable()
export class IntegrationProcafeService {
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    private http: Http,
    private auth: AuthService
  ) { }

  listPaged(processType: string, filter: string, page: Page<IntegrationProcafe>) {

    let params: URLSearchParams = new URLSearchParams();
    if (processType) {
      params.set('processtype',processType);
    }
    if (filter) {
      params.set('filter', filter);
    }

    params.appendAll(page.toURLSearchParams());
    //params.appendAll(params);
    return this.http.get(
      `${Endpoints.integrationProcafeLogUrl}/paged`,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers), search: params }
    )
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = IntegrationProcafe.fromListData(page.data);
        return page;
      });
  }

}
