import { AuthService } from './../auth/auth.service';
import { Endpoints } from './../endpoints';
import { Page } from './../shared/page/page';
import { Transportation } from './transportation';
import { TransportationFilter } from './transportation-filter';
import { TransportationStatus } from './transportation-status';
import { TransportationTotals } from './transportation-totals';
import { Injectable } from '@angular/core';
import { Headers, Http, ResponseContentType, URLSearchParams } from '@angular/http';
import {TransportationType} from "./transportation-type";

@Injectable()
export class TransportationService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http: Http,
    private auth: AuthService) {}

  listPaged(
    filter: TransportationFilter,
    page: Page<Transportation>,
    keepUntouched = false
  ) {
    let params = new URLSearchParams();
    page.itemsPerPage = 30;
    params.appendAll(page.toURLSearchParams());

    if (filter) {
      params.appendAll(filter.toURLSearchParams());
    }

    let idsToKeepUntouched = page.data.filter(d => d.opened).map(d => d.id);

    return this.http.get(
      `${Endpoints.transportationUrl}/paged`,
      { search: params }
    )
      .toPromise()
      .then(response => {
        let serverData = response.json();
        serverData.content = Transportation.fromListData(serverData.content);
        page.setResultFromServer(
          serverData,
          idsToKeepUntouched
        );
        return page;
      });
  }

  listTotals() {
    return this.http.get(
      `${Endpoints.transportationUrl}/totals`
    )
      .toPromise()
      .then(response => {
        return TransportationTotals.fromListData(response.json());
      });
  }

  list(): Promise<Array<Transportation>> {
    return this.http.get(Endpoints.transportationUrl)
      .toPromise()
      .then(response => {
        return Transportation.fromListData(response.json());
      });
  }

  downloadWaitList(): Promise<void> {
    return this.http.get(
        Endpoints.reportWaitListUrl,
        {
          responseType: ResponseContentType.Blob,
        }
      )
      .toPromise()
      .then(response => {
        let url = window.URL.createObjectURL(response.blob());
        window.open(url);
      });
  }

  find(id: number | string) {
    let url = `${Endpoints.transportationUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        let transportation = Transportation.fromData(response.json());

        return transportation;
    });
  }

  findByBatchOperation(id: string) {
    let url = `${Endpoints.transportationUrl}/batch-operation/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        let transportation = Transportation.fromData(response.json());

        return transportation;
    });
  }

  findByShippingAuthorization(id: string) {
    let url = `${Endpoints.transportationUrl}/shipping-authorization/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        return Transportation.fromListData(response.json());
      });
  }

  save(transportation: Transportation): Promise<Transportation> {
    if(transportation.type === TransportationType.IN.code){
      if (transportation.id) {
        return this.updateIn(transportation);
      }else {
        return this.createIn(transportation);
      }
    }else if (transportation.type === TransportationType.OUT.code){
      if (transportation.id) {
        return this.updateOut(transportation);
      }else {
        return this.createOut(transportation);
      }
    }else {
      return;
    }

  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.transportationUrl}/${id}`;
    return this.http.delete(
        url,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(() => null);
  }

  updateStatus(transportation: Transportation, status: TransportationStatus): Promise<Transportation> {
    const url = `${Endpoints.transportationUrl}/${transportation.id}/status`;
    return this.http
      .put(
        url,
        {
          status: status.code
        },
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(() => transportation);
  }

  finishBoarding(transportation: Transportation): Promise<Transportation> {
    const url = `${Endpoints.transportationUrl}/${transportation.id}/finish`;
    return this.http
      .put(
        url,
        null,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(() => transportation);
  }

  reopen(id: string): Promise<Transportation> {
    const url = `${Endpoints.transportationUrl}/${id}/reopen`;
    return this.http
      .put(
        url,
        null,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(res => Transportation.fromData(res.json()));
  }

  private createIn(transportation: Transportation): Promise<Transportation> {
    const url = `${Endpoints.transportationUrl}/in`;
    return this.http
      .post(
        url,
        transportation,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(res => Transportation.fromData(res.json()));
  }

  private updateIn(transportation: Transportation): Promise<Transportation> {
    const url = `${Endpoints.transportationUrl}/in/${transportation.id}`;
    return this.http
      .put(
        url,
        transportation,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then((res) => Transportation.fromData(res.json()));
  }

  private createOut(transportation: Transportation): Promise<Transportation> {
    const url = `${Endpoints.transportationUrl}/out`;
    return this.http
      .post(
        url,
        transportation,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(res => res.json());
  }

  private updateOut(transportation: Transportation): Promise<Transportation> {
    const url = `${Endpoints.transportationUrl}/out/${transportation.id}`;
    return this.http
      .put(
        url,
        transportation,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(() => transportation);
  }

  updateFromBalance(transportation: Transportation): Promise<Transportation> {
    const url = `${Endpoints.transportationUrl}/update-from-balance`;
    return this.http
      .put(
        url,
        transportation,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then((res) => Transportation.fromData(res.json()));
  }

  downloadDocumentEntryReport(transportationId: string): Promise<Blob> {
    let url = `${Endpoints.documentEntryTransportationReport}`;
    return this.http
      .get(`${url}/${transportationId}`, {
        headers: this.auth.appendOrCreateAuthHeader(this.headers),
        responseType: ResponseContentType.Blob
      })
      .toPromise()
      .then(response => {
        return response.blob();
      });
  }

  downloadDocumentExitReport(transportationId: string): Promise<Blob> {
    let url = `${Endpoints.documentExitTransportationReport}`;
    return this.http
      .get(`${url}/${transportationId}`, {
        headers: this.auth.appendOrCreateAuthHeader(this.headers),
        responseType: ResponseContentType.Blob
      })
      .toPromise()
      .then(response => {
        return response.blob();
      });
  }

}
