import { AuthService } from '../auth/auth.service';
import { Endpoints } from '../endpoints';
import { Page } from '../shared/page/page';
import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { IndicationSpecialCoffee } from './indication-special-coffee';

@Injectable()
export class IndicationSpecialCoffeService {
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    private http: Http,
    private auth: AuthService,
  ) { }

  listPaged(filter: any, page: Page<IndicationSpecialCoffee>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('search', filter ? filter : '');
    return this.http.get(
      `${Endpoints.indicationSpecialCoffeeUrl}/paged`,
      { search: params }
    )
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = IndicationSpecialCoffee.fromListData(page.data);
        return page;
      });
  }

  find(id: string): Promise<IndicationSpecialCoffee> {
    return this.http.get(Endpoints.indicationSpecialCoffeeUrl + `/${id}`)
      .toPromise()
      .then(response => {
        return IndicationSpecialCoffee.fromData(response.json());
      });
  }

  save(indicationSpecialCoffee: IndicationSpecialCoffee): Promise<IndicationSpecialCoffee> {

    return this.http
      .post(Endpoints.indicationSpecialCoffeeUrl + '/save', JSON.stringify(indicationSpecialCoffee), {
        headers: this.auth.appendOrCreateAuthHeader(this.headers)
      })
      .toPromise()
      .then(response => {
        return IndicationSpecialCoffee.fromData(response.json());
      });
  }

  /*private update(serviceInstructionType: ServiceInstructionType): Promise<ServiceInstructionType> {
    const url = `${Endpoints.serviceInstructionTypeUrl}/${serviceInstructionType.id}`;
    return this.http
      .put(
        url,
        serviceInstructionType,
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then(() => serviceInstructionType);
  }*/
}
