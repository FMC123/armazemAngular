import { AuthService } from './../auth/auth.service';
import { Endpoints } from './../endpoints';
import { Page } from './../shared/page/page';
import { ServiceInstructionType } from './service-instruction-type';
import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';

@Injectable()
export class ServiceInstructionTypeService {
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    private http: Http,
    private auth: AuthService,
  ) { }

  listPaged(filter: any, page: Page<ServiceInstructionType>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('search', filter ? filter : '');
    return this.http.get(
      `${Endpoints.serviceInstructionTypeUrl}/paged`,
      { search: params }
    )
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = ServiceInstructionType.fromListData(page.data);
        return page;
      });
  }

  list(): Promise<Array<ServiceInstructionType>> {
    return this.http.get(Endpoints.serviceInstructionTypeUrl)
      .toPromise()
      .then(response => {
        return ServiceInstructionType.fromListData(response.json());
      });
  }

  find(id: number | string) {
    let url = `${Endpoints.serviceInstructionTypeUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        let serviceInstructionType = ServiceInstructionType.fromData(response.json());
        return serviceInstructionType;
      });
  }

  save(serviceInstructionType: ServiceInstructionType): Promise<ServiceInstructionType> {
    if (serviceInstructionType.id) {
      return this.update(serviceInstructionType);
    } else {
      return this.create(serviceInstructionType);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.serviceInstructionTypeUrl}/${id}`;
    return this.http.delete(
      url,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
    )
      .toPromise()
      .then(() => null);
  }

  private create(serviceInstructionType: ServiceInstructionType): Promise<ServiceInstructionType> {
    return this.http
      .post(
        Endpoints.serviceInstructionTypeUrl,
        serviceInstructionType,
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then(res => res.json().data);
  }

  private update(serviceInstructionType: ServiceInstructionType): Promise<ServiceInstructionType> {
    const url = `${Endpoints.serviceInstructionTypeUrl}/${serviceInstructionType.id}`;
    return this.http
      .put(
        url,
        serviceInstructionType,
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then(() => serviceInstructionType);
  }
}
