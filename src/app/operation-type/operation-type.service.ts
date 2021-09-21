import { AuthService } from './../auth/auth.service';
import { Endpoints } from './../endpoints';
import { Page } from './../shared/page/page';
import { OperationType } from './operation-type';
import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';

@Injectable()
export class OperationTypeService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http: Http,
    private auth: AuthService,
  ) {}

  listPaged(filter: any, page: Page<OperationType>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('search', filter ? filter : '');
    return this.http.get(
      `${Endpoints.operationTypeUrl}/paged`,
      { search: params }
    )
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = OperationType.fromListData(page.data);
        return page;
      });
  }

  list(): Promise<Array<OperationType>> {
    return this.http.get(Endpoints.operationTypeUrl)
      .toPromise()
      .then(response => {
        return OperationType.fromListData(response.json());
      });
  }

  find(id: number | string) {
    let url = `${Endpoints.operationTypeUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        let operationType = OperationType.fromData(response.json());
        return operationType;
    });
  }

  save(operationType: OperationType): Promise<OperationType> {
    if (operationType.id) {
      return this.update(operationType);
    }else {
      return this.create(operationType);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.operationTypeUrl}/${id}`;
    return this.http.delete(
        url,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(() => null);
  }

  private create(operationType: OperationType): Promise<OperationType> {
    return this.http
      .post(
        Endpoints.operationTypeUrl,
        operationType,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(res => res.json().data);
  }

  private update(operationType: OperationType): Promise<OperationType> {
    const url = `${Endpoints.operationTypeUrl}/${operationType.id}`;
    return this.http
      .put(
        url,
        operationType,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(() => operationType);
  }
}
