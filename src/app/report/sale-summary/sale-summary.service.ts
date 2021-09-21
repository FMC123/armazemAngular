
import { Injectable } from '@angular/core';
import { Logger } from 'app/shared/logger/logger';
import { AuthService } from 'app/auth/auth.service';
import { Endpoints } from 'app/endpoints';
import { Headers, Http, ResponseContentType, URLSearchParams } from '@angular/http';
import { DuctClean } from 'app/report/duct-clean/duct-clean';


@Injectable()
export class SaleSummaryService {
  private headers = new Headers({'Content-Type': 'application/json'});
  constructor(private http: Http,
              private auth: AuthService  ) {
  }
  find(sellCode: string ): Promise<Blob> {
    let url = `${Endpoints.saleSummaryReport}`;
    let params = new URLSearchParams();
    params.append('sellCode', sellCode);
    return this.http.get(
      url,
      {
        responseType: ResponseContentType.Blob,
        search: params,
      }
    )
      .toPromise()
      .then(response => {
        return response.blob();
      });
  }
}
