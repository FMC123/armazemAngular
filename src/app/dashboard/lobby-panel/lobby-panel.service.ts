import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { AuthService } from '../../auth/auth.service';
import { Endpoints } from '../../endpoints';
import { LobbyPanel } from './lobby-panel';
import {BatchOperationFilter} from "../../batch-operation/batch-operation-list/batch-operation-filter";
import {Page} from "../../shared/page/page";
import {BatchOperation} from "../../batch-operation/batch-operation";

@Injectable()
export class LobbyPanelService {
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http, private auth: AuthService) {}

  load() {
    let url = `${Endpoints.lobbyPanelUrl}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => {
        return LobbyPanel.fromListData(response.json());
      });
  }

  listPaged( page: Page<LobbyPanel>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    return this.http
      .get(`${Endpoints.lobbyPanelUrl}/paged`, { search: params })
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = LobbyPanel.fromListData(page.data);
        return page;
      });
  }
}
