import {ClassifSpecialCoffee} from "../classification-special-coffee/classif-special-coffee";
import {Endpoints} from "../../endpoints";
import {Headers, Http, ResponseContentType} from "@angular/http";
import {AuthService} from "../../auth/auth.service";
import {Injectable} from "@angular/core";
import {AuditInventoryReport} from "./audit-inventory-report";
import {AuditInventoryReportFilter} from "./audit-inventory-report-filter";

@Injectable()
export class AuditInventoryReportService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {
  }

  relatorioEstoqueAuditoriaCsv(auditInventoryReportFilter: AuditInventoryReportFilter): Promise<Array<AuditInventoryReport>> {
    let url = `${Endpoints.auditInventoryReportCsv}`;

    return this.http.get(url, {
      headers: this.auth.appendOrCreateAuthHeader(this.headers),
      responseType: ResponseContentType.Json,
      search: auditInventoryReportFilter.toURLSearchParams()
    })
      .toPromise()
      .then(response => {
        return AuditInventoryReport.fromListData(response.json());
      });

  }

}
