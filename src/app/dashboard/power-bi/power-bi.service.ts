import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { AuthService } from '../../auth/auth.service';
import { Endpoints } from '../../endpoints';

@Injectable()
export class PowerBiService {
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http, private auth: AuthService) {}

  getAccessToken() {
    let url = `${Endpoints.powerBI}/token`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response.json());
  }

  refreshAccessToken(powerBiToken) {
    let url = `${Endpoints.powerBI}/refresh-token`;
    return this.http
      .post(url, JSON.stringify(powerBiToken), {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(response => response.json());
  }

  isAccessTokenExpired(accessToken: string) {
    let url = 'https://api.powerbi.com/powerbi/globalservice/v201606/clusterdetails';
    let params = new URLSearchParams();
    params.append('authorization', 'Bearer ' + accessToken);
    return this.http.get(url, params)
      .toPromise()
  }
}
