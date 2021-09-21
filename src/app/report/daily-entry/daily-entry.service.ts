
import { Injectable } from '@angular/core';
import { Logger } from 'app/shared/logger/logger';
import { AuthService } from 'app/auth/auth.service';
import { DailyEntry } from 'app/report/daily-entry/daily-entry';
import { Endpoints } from 'app/endpoints';
import { Headers, Http, ResponseContentType, URLSearchParams } from '@angular/http';
import { DailyEntryBatchOperation } from './daily-entry-batch-operation';


@Injectable()
export class DailyEntryService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private http: Http,
    private auth: AuthService) {
  }
  find(dataEntry: DailyEntry): Promise<Blob> {
    let url = `${Endpoints.dailyEntryReport}`;
    return this.http.post(
      url, JSON.stringify(dataEntry),
      { headers: this.auth.appendOrCreateAuthHeader(this.headers), responseType: ResponseContentType.Blob }
    )
      .toPromise()
      .then(response => {
        return response.blob();
      });
  }

  findCsv(dataEntry: DailyEntry): Promise<Array<DailyEntryBatchOperation>> {
    let url = `${Endpoints.dailyEntryReportList}`;
    return this.http.post(
      url, JSON.stringify(dataEntry),
      { headers: this.auth.appendOrCreateAuthHeader(this.headers), responseType: ResponseContentType.Json }
    )
      .toPromise()
      .then(response => {
        return DailyEntryBatchOperation.fromListData(response.json());
      });
  }


}
