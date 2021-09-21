
import { Injectable } from '@angular/core';
import { Logger } from 'app/shared/logger/logger';
import { AuthService } from 'app/auth/auth.service';
import { Endpoints } from 'app/endpoints';
import { Headers, Http, ResponseContentType, URLSearchParams } from '@angular/http';
import { DuctClean } from 'app/report/duct-clean/duct-clean';
import { StorageUnitBatch } from '../../storage-unit/storage-unit-batch';
import { PrintTag } from './print-tag';


@Injectable()
export class PrintTagService {
  private headers = new Headers({'Content-Type': 'application/json'});
  constructor(private http: Http,
              private auth: AuthService  ) {
  }
  find(printTag: PrintTag): Promise<Blob> {
    let url = `${Endpoints.printTagReport}`;
    return this.http.post(
      url, JSON.stringify(printTag),
      {headers: this.auth.appendOrCreateAuthHeader(this.headers), responseType: ResponseContentType.Blob}
    )
      .toPromise()
      .then(response => {
        return response.blob();
      });
  }

  findWithBatches(tagCode: string, batches: Array<StorageUnitBatch>): Promise<Blob> {
    let url = `${Endpoints.printTagReportWithBatches(tagCode)}`;
    return this.http.post(
      url, JSON.stringify(batches),
      {headers: this.auth.appendOrCreateAuthHeader(this.headers), responseType: ResponseContentType.Blob}
    )
      .toPromise()
      .then(response => {
        return response.blob();
      });
  }


}
