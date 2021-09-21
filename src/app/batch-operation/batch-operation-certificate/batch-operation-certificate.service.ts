import { BatchOperationCertificate } from './batch-operation-certificate';
import { Endpoints } from '../../endpoints';
import { AuthService } from '../../auth/auth.service';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class BatchOperationCertificateService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http: Http,
    private auth: AuthService
  ) {}

  list(batchOperationId: string, withImage: boolean): Promise<any> {
    let params = new URLSearchParams();
    params.append('batchOperationId', batchOperationId);
    params.append('withImage', (withImage === true ? "true" : "false"));

    return this.http
      .get(
        Endpoints.batchOperationCertificateUrl,
        { search: params }
      )
      .toPromise()
      .then(response => {
        return BatchOperationCertificate.fromListData(response.json());
      });
  }

  create(batchOperationCertificate: BatchOperationCertificate): Promise<BatchOperationCertificate> {
    const url = `${Endpoints.batchOperationCertificateUrl}`;

    return this.http
      .post(url, batchOperationCertificate,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json());
  }

  delete(id: string): Promise<void> {
    let url = `${Endpoints.batchOperationCertificateUrl}/${id}`;
    return this.http.delete(
        url,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(() => null);
  }

  sync(warehouseId: string, syncDate: number): Promise<any> {
    let params = new URLSearchParams();

    if (syncDate) {
      params.append('syncDate', syncDate + '');
    }

    return this.http
      .get(
        Endpoints.batchOperationCertificateUrl + '/sync/all',
        { search: params }
      )
      .toPromise()
      .then(response => {
        return BatchOperationCertificate.fromListData(response.json());
      });
  }

  listAtEndOfTheDay(warehouseId: string, day: number): Promise<any> {
    let params = new URLSearchParams();

    if (day) {
      params.append('day', day + '');
    }

    params.append('warehouseId', this.auth.accessToken.warehouse.id);

    return this.http
      .get(
        Endpoints.batchOperationCertificateUrl + '/at-day',
        { search: params }
      )
      .toPromise()
      .then(response => {
        return BatchOperationCertificate.fromListData(response.json());
      });
  }

}
