import { Endpoints } from '../../endpoints';
import { Page } from '../../shared/page/page';
import { AuthService } from '../../auth/auth.service';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import {EquipamentDestination} from "./equipament-destination";

@Injectable()
export class EquipamentDestinationService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http: Http,
    private auth: AuthService
  ) {}

  listPaged(equipamentOriginId: string, page: Page<EquipamentDestination>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    return this.http.get(`${Endpoints.equipamentDestinationByOriginUrl(equipamentOriginId)}/paged`,
      {
        search: params,
      })
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = EquipamentDestination.fromListData(page.data);
        return page;
      });
  }

  find(equipamentDestinationId: string) {
    let url = `${Endpoints.equipamentDestinationUrl}/${equipamentDestinationId}`;
    return this.http.get(url)
      .toPromise()
      .then(response => EquipamentDestination.fromData(response.json()));
  }

  save(equipamentDestination: EquipamentDestination): Promise<EquipamentDestination> {
    if (equipamentDestination.id) {
      return this.update(equipamentDestination);
    }else {
      return this.create(equipamentDestination);
    }
  }

  delete(EquipamentDestination: string | number): Promise<void> {
    let url = `${Endpoints.equipamentDestinationUrl}/${EquipamentDestination}`;
    return this.http.delete(url,
      {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  private create(equipamentDestination: EquipamentDestination): Promise<EquipamentDestination> {
    return this.http
      .post(Endpoints.equipamentDestinationUrl, JSON.stringify(equipamentDestination),
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => EquipamentDestination.fromData(res.json()));
  }

  private update(equipamentDestination: EquipamentDestination): Promise<EquipamentDestination> {
    const url = `${Endpoints.equipamentDestinationUrl}/${equipamentDestination.id}`;
    return this.http
      .put(url, JSON.stringify(equipamentDestination),
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => EquipamentDestination.fromData(res.json()));
  }
}
