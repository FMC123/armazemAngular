import { Headers, Http, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import {Endpoints} from "../endpoints";
import {AuthService} from "../auth/auth.service";
import {BatchCertificate} from "./batch-certificate";

@Injectable()
export class BatchCertificateService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http: Http,
    private auth: AuthService
  ) {}

  list(batchId: string, withImage: boolean): Promise<any> {
    let params = new URLSearchParams();
    params.append('batchId', batchId);
    params.append('withImage', (withImage === true ? "true" : "false"));

    return this.http
      .get(
        Endpoints.batchCertificateUrl,
        { search: params }
      )
      .toPromise()
      .then(response => {
        return BatchCertificate.fromListData(response.json());
      });
  }
}
