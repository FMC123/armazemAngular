import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { Sample } from '../sample';
import { Endpoints } from '../../endpoints';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../user/user';
import { Batch } from '../../batch/batch';
import { TypeCoffee } from '../../pack-type/type-coffee';
import {SampleMovementHistory} from "../sample-movement-history";
import {ClassificationVersion} from "../../classification/classification-version";

@Injectable()
export class SampleMovementHistoryService {
	private headers = new Headers({ 'Content-Type': 'application/json' });

	constructor(private http: Http, private auth: AuthService) {}

  listAllSampleMovements(sampleId: any): Promise<Array<SampleMovementHistory>> {
    let params = new URLSearchParams();
    params.append('sampleId', sampleId ? sampleId : '');

    return this.http
      .get(`${Endpoints.sampleMovementHistoryUrl}`, {
        search: params
      })
      .toPromise()
      .then(response => {
        return SampleMovementHistory.fromListData(response.json());
      });
  }

  listSampleMovementsNotConclude(sampleId: any): Promise<Array<SampleMovementHistory>> {
    let params = new URLSearchParams();
    params.append('sampleId', sampleId ? sampleId : '');

    return this.http
      .get(`${Endpoints.sampleMovementHistoryNotConcludeUrl}`, {
        search: params
      })
      .toPromise()
      .then(response => {
        return SampleMovementHistory.fromListData(response.json());
      });
  }

  requestSample(sampleMovementHistory: SampleMovementHistory): Promise<SampleMovementHistory> {
    let url = `${Endpoints.sampleUrl}/request-sample`;
    return this.http
      .put(url, JSON.stringify(sampleMovementHistory), { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => res);
  }

  sendSample(sampleMovementHistory: SampleMovementHistory): Promise<SampleMovementHistory> {
    let url = `${Endpoints.sampleUrl}/send-sample`;
    return this.http
      .put(url, JSON.stringify(sampleMovementHistory), { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => res);
  }

  returnSample(sampleMovementHistory: SampleMovementHistory): Promise<SampleMovementHistory> {
    let url = `${Endpoints.sampleUrl}/return-sample`;
    return this.http
      .put(url, JSON.stringify(sampleMovementHistory), { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => res);
  }

  requestPicote(sampleId: string, quantity: number): Promise<SampleMovementHistory> {
    let url = `${Endpoints.sampleUrl}/request-picote/${sampleId}`;
    return this.http
      .put(url, JSON.stringify(quantity),{ headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res);
  }

  receivePicote(sampleId: any): Promise<SampleMovementHistory> {
    let url = `${Endpoints.sampleUrl}/receive-picote`;
    return this.http
      .put(url, JSON.stringify(sampleId), { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => res);
  }

  removeSample(sampleMovementHistory: SampleMovementHistory): Promise<SampleMovementHistory> {
    let url = `${Endpoints.sampleUrl}/remove-sample`;
    return this.http
      .put(url, JSON.stringify(sampleMovementHistory), { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => res);
  }

  acceptedPicote(sampleId: any): Promise<SampleMovementHistory> {
    let url = `${Endpoints.sampleUrl}/accepted-picote`;
    return this.http
      .put(url, JSON.stringify(sampleId), { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => res);
  }

  readytoshipPicote(sampleId: any): Promise<SampleMovementHistory> {
    let url = `${Endpoints.sampleUrl}/readytoship-picote`;
    return this.http
      .put(url, JSON.stringify(sampleId), { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => res);
  }

  sentPicote(sampleId: any): Promise<SampleMovementHistory> {
    let url = `${Endpoints.sampleUrl}/sent-picote`;
    return this.http
      .put(url, JSON.stringify(sampleId), { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => res);
  }

  closedSample(sampleId: any): Promise<SampleMovementHistory> {
    let url = `${Endpoints.sampleUrl}/closed`;
    return this.http
      .put(url, JSON.stringify(sampleId), { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => res);
  }
}
