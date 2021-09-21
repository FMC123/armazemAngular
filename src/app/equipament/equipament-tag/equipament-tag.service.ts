import { Endpoints } from '../../endpoints';
import { Page } from '../../shared/page/page';
import { AuthService } from '../../auth/auth.service';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { EquipamentTag } from './equipament-tag';

@Injectable()
export class EquipamentTagService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http: Http,
    private auth: AuthService
  ) {}

  listPaged(equipamentId: string, page: Page<EquipamentTag>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    return this.http.get(`${Endpoints.equipamentTagUrl(equipamentId)}/paged`,
                        {
                          search: params,
                        })
                        .toPromise()
                        .then(response => {
                          page.setResultFromServer(response.json());
                          page.data = EquipamentTag.fromListData(page.data);
                          return page;
                        });
  }

  list(equipamentId: string) {
    return this.http.get(`${Endpoints.equipamentTagUrl(equipamentId)}`)
                        .toPromise()
                        .then(response => {
                          return EquipamentTag.fromListData(response.json());
                        });
  }

  find(equipamentId: string, id: number | string) {
    let url = `${Endpoints.equipamentTagUrl(equipamentId)}/${id}`;
    return this.http.get(url)
               .toPromise()
               .then(response => EquipamentTag.fromData(response.json()));
  }

  save(equipamentTag: EquipamentTag): Promise<EquipamentTag> {
    if (equipamentTag.id) {
      return this.update(equipamentTag);
    }else {
      return this.create(equipamentTag);
    }
  }

  delete(equipamentId: string, id: number | string): Promise<void> {
    let url = `${Endpoints.equipamentTagUrl(equipamentId)}/${id}`;
    return this.http.delete(url,
                            {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  private create(equipamentTag: EquipamentTag): Promise<EquipamentTag> {
    return this.http
      .post(Endpoints.equipamentTagUrl(equipamentTag.equipament.id), JSON.stringify(equipamentTag),
          {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => EquipamentTag.fromData(res.json()));
  }

  private update(equipamentTag: EquipamentTag): Promise<EquipamentTag> {
    const url = `${Endpoints.equipamentTagUrl(equipamentTag.equipament.id)}/${equipamentTag.id}`;
    return this.http
      .put(url, JSON.stringify(equipamentTag),
          {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => EquipamentTag.fromData(res.json()));
  }
}
