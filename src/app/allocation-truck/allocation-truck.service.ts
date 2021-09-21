import { Endpoints } from '../endpoints';
import { Page } from '../shared/page/page';
import { AllocationTruck } from './allocation-truck';
import { AuthService } from '../auth/auth.service';
import { Injectable } from '@angular/core';
import { Headers, Http, Response, URLSearchParams } from '@angular/http';

@Injectable()
export class AllocationTruckService {
  private headers = new Headers({'Content-Type': 'application/json'});
  public allocationTruckEditable: AllocationTruck;

  constructor(
    private http: Http,
    private auth: AuthService
  ) { }


  listPaged(filter: any, page: Page<AllocationTruck>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('markupGroupId', filter ? filter : '');
    return this.http.get(
      `${Endpoints.allocationTruckUrl}/paged`,
      {
        search: params,
      }
    )
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = AllocationTruck.fromListData(page.data);
        return page;
      });
  }

    save(allocationTrucks: Array<AllocationTruck>): Promise<any> {
      return this.http
      .post(`${Endpoints.allocationTruckUrl}`, JSON.stringify(allocationTrucks),
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise();
    }

    delete(id: number | string): Promise<void> {
      let url = `${Endpoints.allocationTruckUrl}/${id}`;
      return this.http.delete(url,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
        .toPromise()
        .then(() => null);
    }

    find(id: number | string) {
      let url = `${Endpoints.allocationTruckUrl}/${id}`;
      return this.http.get(url)
        .toPromise()
        .then(response => {
        let allocationTrucks = AllocationTruck.fromListData(response.json());
        return allocationTrucks;
      });
    }
  }

