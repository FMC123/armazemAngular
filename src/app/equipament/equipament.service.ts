import { AuthService } from '../auth/auth.service';
import { Endpoints } from '../endpoints';
import { Page } from '../shared/page/page';
import { Equipament } from './equipament';
import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';

@Injectable()
export class EquipamentService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http: Http,
    private auth: AuthService,
  ) {}

  listPaged(filter: any, page: Page<Equipament>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('search', filter ? filter : '');
    return this.http.get(
      `${Endpoints.equipamentUrl}/paged`,
      { search: params }
    )
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = Equipament.fromListData(page.data);
        return page;
      });
  }

  list(): Promise<Array<Equipament>> {
    return this.http.get(Endpoints.equipamentUrl)
      .toPromise()
      .then(response => {
        return Equipament.fromListData(response.json());
      });
  }

  find(id: number | string) {
    let url = `${Endpoints.equipamentUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        let equipament = Equipament.fromData(response.json());
        return equipament;
    });
  }

  save(equipament: Equipament): Promise<Equipament> {
    if (equipament.id) {
      return this.update(equipament);
    }else {
      return this.create(equipament);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.equipamentUrl}/${id}`;
    return this.http.delete(
        url,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(() => null);
  }

  private create(equipament: Equipament): Promise<Equipament> {
    return this.http
      .post(
        Endpoints.equipamentUrl,
        equipament,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(res => res.json().data);
  }

  private update(equipament: Equipament): Promise<Equipament> {
    const url = `${Endpoints.equipamentUrl}/${equipament.id}`;
    return this.http
      .put(
        url,
        equipament,
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)}
      )
      .toPromise()
      .then(() => equipament);
  }
}
