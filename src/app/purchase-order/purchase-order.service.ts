import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Endpoints } from '../endpoints';
import { Page } from '../shared/page/page';
import { PurchaseOrder } from './purchase-order';
import { PurchaseOrderFilter } from './purchase-order-filter';
import { AuthService } from 'app/auth/auth.service';
import { PurchaseOrderTotal } from './purchase-order-total';

@Injectable()
export class PurchaseOrderService {

  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http,
    private auth: AuthService) { }

  find(id: string) {
    let url = `${Endpoints.purchaseOrderUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        return PurchaseOrder.fromData(response.json());
      });
  }

  listPaged(filter: PurchaseOrderFilter, page: Page<PurchaseOrder>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());

    if (filter) {
      params.appendAll(filter.toURLSearchParams());
    }

    return this.http.get(`${Endpoints.purchaseOrderUrl}/paged`,
      { search: params })
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = PurchaseOrder.fromListData(page.data);
        return page;
      });
  }

  /**
   * Totalizador de orders de compra, baseado no filtro da paginação
   * 
   * @param filter 
   */
  totals(filter: PurchaseOrderFilter) {
    let params = new URLSearchParams();

    if (filter) {
      params.appendAll(filter.toURLSearchParams());
    }

    return this.http.get(`${Endpoints.purchaseOrderUrl}/total`,
      { search: params })
      .toPromise()
      .then(response => {
        return PurchaseOrderTotal.fromData(response.json());
      });
  }

  /**
   * Lista de ordens de compra não descarregadas por cliente
   */
  listNotDischarged(clientId: string): Promise<Array<PurchaseOrder>> {

    let url = `${Endpoints.purchaseOrderUrl}/list-not-discharged/${clientId}`;

    return this.http.get(url).toPromise().then(response => {
      return PurchaseOrder.fromListData(response.json());
    });
  }

  save(purchaseOrder: PurchaseOrder): Promise<PurchaseOrder> {
    if (purchaseOrder.id) {
      return this.update(purchaseOrder);
    } else {
      return this.create(purchaseOrder);
    }
  }

  delete(code: number | string): Promise<void> {
    let url = `${Endpoints.purchaseOrderUrl}/${code}`;
    return this.http.delete(url,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(() => null);
  }

  private create(PurchaseOrder: PurchaseOrder): Promise<PurchaseOrder> {
    const url = `${Endpoints.purchaseOrderUrl}`;
    return this.http
      .post(url, JSON.stringify(PurchaseOrder),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => res.json());
  }

  private update(PurchaseOrder: PurchaseOrder): Promise<PurchaseOrder> {
    const url = `${Endpoints.purchaseOrderUrl}`;
    return this.http
      .put(url, JSON.stringify(PurchaseOrder),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => res.json());
  }
}