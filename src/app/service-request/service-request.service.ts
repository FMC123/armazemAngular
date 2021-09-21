import { AuthService } from './../auth/auth.service';
import { Endpoints } from './../endpoints';
import { Page } from './../shared/page/page';
import { ServiceRequest } from './service-request';
import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { ServiceRequestListFilter } from './service-request-list/service-request-list-filter';
import { data } from './service-request-data';

@Injectable()
export class ServiceRequestService {
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    private http: Http,
    private auth: AuthService,
  ) { }

  listPaged(filter: ServiceRequestListFilter, page: Page<ServiceRequest>) {
    /*let list = data;
    let filterValue = filter.codeOrBatch;
    let type = filter.type;
    if (filterValue) {
      filterValue = filterValue.toLowerCase();
      list = list.filter(serviceRequest => (serviceRequest.batch.search(filterValue) > -1)
        || (serviceRequest.collaborator.toLowerCase().search(filterValue) > -1)
        || serviceRequest.createdDateString === filterValue);
    }
    if (type) {
      list = list.filter(serviceRequest => serviceRequest.type === type);
    }
    page.setResult(list, list.length, 'createdDate', 'DESC');
    return Promise.resolve(page);*/
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    if (filter.codeOrBatch)
      params.append('codeOrBatch', filter.codeOrBatch);
    if (filter.type)
      params.append('type', filter.type);
    if (filter.status)
      params.append('status', filter.status);
    return this.http.get(
      `${Endpoints.serviceRequestUrl}/paged`,
      { search: params }
    )
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = ServiceRequest.fromListData(page.data);
        return page;
      });
  }

  list(): Promise<Array<ServiceRequest>> {
    return this.http.get(Endpoints.serviceRequestUrl)
      .toPromise()
      .then(response => {
        return ServiceRequest.fromListData(response.json());
      });
  }

  find(id: number | string) {

    // return Promise.resolve(data.find(serviceRequest => serviceRequest.id === id));
    let url = `${Endpoints.serviceRequestUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        let serviceRequest = ServiceRequest.fromData(response.json());
        return serviceRequest;
      });
  }

  save(serviceRequest: ServiceRequest): Promise<ServiceRequest> {
    if (serviceRequest.id) {
      return this.update(serviceRequest);
    } else {
      return this.create(serviceRequest);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.serviceRequestUrl}/${id}`;
    return this.http.delete(
      url,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
    )
      .toPromise()
      .then(() => null);
  }

  private create(serviceRequest: ServiceRequest): Promise<ServiceRequest> {
    return this.http
      .post(
        Endpoints.serviceRequestUrl,
        serviceRequest,
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then(res => res.json().data);
  }

  private update(serviceRequest: ServiceRequest): Promise<ServiceRequest> {
    const url = `${Endpoints.serviceRequestUrl}/${serviceRequest.id}`;
    return this.http
      .put(
        url,
        serviceRequest,
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then(() => serviceRequest);
  }
}
