import { Injectable } from '@angular/core';
import {Headers, Http, ResponseContentType, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AuthService } from '../auth/auth.service';
import { Endpoints } from '../endpoints';
import { Page } from "../shared/page/page";
import { SampleTracking } from "./sample-tracking";
import { Sample } from "../sample/sample";
import { SampleTrackingListFilter } from "./sample-tracking-list/sample-tracking-list-filter";

@Injectable()
export class SampleTrackingService {
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http, private auth: AuthService) { }

  search(filter: any) {
    return this.http
      .post(`${Endpoints.sampleTrackingUrl}/search`, filter)
      .toPromise()
      .then(response => {
        return Sample.fromListData(response.json());
      });
  }


  list(): Promise<Array<SampleTracking>> {
    return this.http.get(Endpoints.sampleTrackingUrl)
      .toPromise()
      .then(response => {
        return SampleTracking.fromListData(response.json());
      });
  }


  listPaged(filter: SampleTrackingListFilter, page: Page<SampleTracking>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.appendAll(filter.toURLSearchParams())
    /*params.append('search', filter ? filter : '');*/
    return this.http.get(`${Endpoints.sampleTrackingUrl}/paged`,
      {
        search: params,
      })
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = SampleTracking.fromListData(page.data);
        return page;
      });
  }

  find(id: number | string) {
    let url = `${Endpoints.sampleTrackingUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        let sampleTracking = SampleTracking.fromData(response.json());
        return sampleTracking;
      });
  }

  save(sampleTracking: SampleTracking): Promise<SampleTracking> {
    if (sampleTracking.id) {
      return this.update(sampleTracking);
    } else {
      return this.create(sampleTracking);
    }
  }

  confirm(sampleTracking: SampleTracking): Promise<SampleTracking> {
    const url = `${Endpoints.sampleTrackingUrl}/confirm`;
    return this.http.put(url, sampleTracking, {
      headers: this.auth.appendOrCreateAuthHeader(this.headers)
    }).toPromise().then(() => sampleTracking);
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.sampleTrackingUrl}/${id}`;
    return this.http.delete(url,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(() => null);
  }

  private create(sampleTracking: SampleTracking): Promise<SampleTracking> {
    const url = `${Endpoints.sampleTrackingUrl}`
    return this.http
      .post(url, JSON.stringify(sampleTracking),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => res.json());
  }

  private update(sampleTracking: SampleTracking): Promise<SampleTracking> {
    const url = `${Endpoints.sampleTrackingUrl}/${sampleTracking.id}`;
    return this.http
      .put(url, sampleTracking
        ,
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(() => sampleTracking);
  }

  /**
   * Lista para autocomplete
   * @param search
   */
  listAutocomplete(search?: string): Promise<Array<SampleTracking>> {
    let params = new URLSearchParams();
    params.append('search', search ? search : '');
    params.append('limit', '10');

    return this.http.get(
      Endpoints.sampleTrackingAutocompleteUrl,
      { search: params },
    )
      .toPromise()
      .then(response => {
        return SampleTracking.fromListData(response.json());
      });
  }

  sampleTrackingReportList(batchesId: Array<String>): Promise<Blob> {
    let url = `${Endpoints.sampleTrackingBatchesReport}`;
    return this.http.post(url, JSON.stringify(batchesId),{
      headers: this.auth.appendOrCreateAuthHeader(this.headers),
      responseType: ResponseContentType.Blob
    })
      .toPromise()
      .then(response => {
        return response.blob();
      });
  }
}
