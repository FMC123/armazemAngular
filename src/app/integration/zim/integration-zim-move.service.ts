import { AuthService } from '../../auth/auth.service';
import { Endpoints } from '../../endpoints';
import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { IntegrationZimMove } from './integration-zim-move';
import { Page } from '../../shared/page/page';

@Injectable()
export class IntegrationZimMoveService {
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    private http: Http,
    private auth: AuthService,
  ) { }

  reloadLog(int: IntegrationZimMove) {
    let params = new URLSearchParams();

    return this.http
      .put(`${Endpoints.integrationUrl}/forcesend/${int.id}`,
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => IntegrationZimMove.fromData(res.json()));
  }




  listPaged(page: Page<IntegrationZimMove>, numeroLote, dateDe, dateAte) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('numeroLote', numeroLote ? numeroLote : '');
    params.append('dateDe', dateDe ? dateDe : '');
    params.append('dateAte', dateAte ? dateAte : '');


    return this.http.get(
      `${Endpoints.integrationUrl}/paged`,
      { search: params }
    )
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = IntegrationZimMove.fromListData(page.data);
        return page;
      });
  }

  listPagedRet(page: Page<IntegrationZimMove>, numeroLote, dateDe, dateAte) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('numeroLote', numeroLote ? numeroLote : '');
    params.append('dateDe', dateDe ? dateDe : '');
    params.append('dateAte', dateAte ? dateAte : '');

    return this.http.get(
      `${Endpoints.integrationUrlRet}/paged`,
      { search: params }
    )
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = IntegrationZimMove.fromListData(page.data);
        return page;
      });
  }


}
