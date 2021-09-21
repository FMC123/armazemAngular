import { AuthService } from './../auth/auth.service';
import { Endpoints } from './../endpoints';
import { Page } from './../shared/page/page';
import { PurchaseProspect } from './purchase-prospect';
import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { data } from './purchase-prospect-data';
import { PurchaseProspectListFilter } from './purchase-prospect-list/purchase-prospect-list-filter';


@Injectable()
export class PurchaseProspectService {
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    private http: Http,
    private auth: AuthService,
  ) { }

  listPaged(filter: PurchaseProspectListFilter, page: Page<PurchaseProspect>) {
    /*let list = data.filter(purchaseProspect => (
      ((!filter.prospect) || (purchaseProspect.code.search(filter.prospect) > -1)) &&
      ((!filter.batch) || (purchaseProspect.batch.find(batch => batch.batch.batchCode === filter.batch))) &&
      ((!filter.collaborator) || (purchaseProspect.collaborator.id === filter.collaborator.id)) &&
      ((!filter.status) || (purchaseProspect.status.toLowerCase().search(filter.status.toLowerCase()) > -1)) &&
      ((!filter.startDate) || (purchaseProspect.createdDate >= filter.startDate)) &&
      ((!filter.endDate) || (purchaseProspect.createdDate <= filter.endDate))));

    page.setResult(list, list.length, 'createdDate', 'DESC');
    return Promise.resolve(page);*/
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.appendAll(filter.toURLSearchParams());


    return this.http.get(
      `${Endpoints.purchaseProspectUrl}/paged`,
      { search: params }
    )
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = PurchaseProspect.fromListData(page.data);
        return page;
      });
  }

  list(): Promise<Array<PurchaseProspect>> {
    return this.http.get(Endpoints.purchaseProspectUrl)
      .toPromise()
      .then(response => {
        return PurchaseProspect.fromListData(response.json());
      });
  }

  find(id: number | string) {
    //return Promise.resolve(data.find(purchaseProspect => purchaseProspect.id === id));
    let url = `${Endpoints.purchaseProspectUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        let purchaseProspect = PurchaseProspect.fromData(response.json());
        return purchaseProspect;
      });
  }

  save(purchaseProspect: PurchaseProspect): Promise<PurchaseProspect> {
    if (purchaseProspect.id) {
      return this.update(purchaseProspect);
    } else {
      return this.create(purchaseProspect);
    }
  }

  delete(id: number | string): Promise<void> {

    //data.splice(data.findIndex(purchaseProspect => purchaseProspect.id === id));
    //return Promise.resolve(null);
    let url = `${Endpoints.purchaseProspectUrl}/${id}`;
    return this.http.delete(
      url,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
    )
      .toPromise()
      .then(() => null);
  }

  private create(purchaseProspect: PurchaseProspect): Promise<PurchaseProspect> {
    //data.push(purchaseProspect);
    //return Promise.resolve(purchaseProspect);
    return this.http
      .post(
        Endpoints.purchaseProspectUrl,
        purchaseProspect,
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then(res => res.json().data);
  }

  private update(purchaseProspect: PurchaseProspect): Promise<PurchaseProspect> {
    //return Promise.resolve(purchaseProspect);
    const url = `${Endpoints.purchaseProspectUrl}/${purchaseProspect.id}`;
    return this.http
      .put(
        url,
        purchaseProspect,
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then(() => purchaseProspect);
  }
}
