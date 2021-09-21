import {Injectable} from "@angular/core";
import {AuthService} from "../auth/auth.service";
import {Endpoints} from "../endpoints";
import {Incident} from "./incident";
import { Http, Headers, URLSearchParams } from '@angular/http';
import {Page} from "../shared/page/page";

@Injectable()
export class IncidentService {
  private headers = new Headers({
    'Content-Type': 'application/json'
  });

  constructor(private http: Http,
              private auth: AuthService,) {
  }

  listByDriver(driver: string, page: Page<Incident>): Promise<Page<Incident>> {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    const url = `${Endpoints.incidentUrl}/driver/${driver}`;
    return this.http.get(url, {search: params})
      .toPromise()
      .then(res => {;
        page.setResultFromServer(res.json());
        page.data = Incident.fromListData(page.data)
        return page;
      });
  }

  save(incident: Incident): Promise<Incident> {
    if (incident.id) {
      return this.update(incident);
    } else {
      return this.create(incident);
    }
  }

  private create(incident: Incident): Promise<Incident> {
    const url = `${Endpoints.incidentUrl}`;
    return this.http.post(url, JSON.stringify(incident),
      {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json());
  }

  private update(incident: Incident): Promise<Incident> {
    const url = `${Endpoints.incidentUrl}/${incident.id}`;
    return this.http.put(url, JSON.stringify(incident),
      {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json());
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.incidentUrl}/${id}`;
    return this.http
      .delete(url, {
        headers: this.auth.appendOrCreateAuthHeader(this.headers)
      })
      .toPromise()
      .then(() => null);
  }

}
