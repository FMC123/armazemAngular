import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';

import { AuthService } from './../auth/auth.service';
import { Endpoints } from './../endpoints';
import { Page } from './../shared/page/page';
import { MobileApp } from './mobile-app';

@Injectable()
export class MobileAppService {
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http,
    private auth: AuthService) { }

  listPaged(filter: any, page: Page<MobileApp>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('search', filter ? filter : '');
    return this.http.get(`${Endpoints.mobileAppUrl}/paged`,
      {
        search: params,
      })
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = MobileApp.fromListData(page.data);
        return page;
      });
  }

  find(id: number | string) {
    let url = `${Endpoints.mobileAppUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        return MobileApp.fromData(response.json());
      });
  }

  saveWithFile(certificate: MobileApp, file: any): Promise<MobileApp> {
    return new Promise((resolve, reject) => {
      try {
        let formData: FormData = new FormData(),
          xhr: XMLHttpRequest = new XMLHttpRequest();

        if (certificate.id) {
          formData.append('id', certificate.id);
        }
        if (certificate.minWmsVersion) {
          formData.append('minWmsVersion', certificate.minWmsVersion);
        }
        if (certificate.mobileAppVersion) {
          formData.append('mobileAppVersion', certificate.mobileAppVersion);
        }
        if (file) {
          formData.append('file', file, file.name);
        }

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              resolve();
            } else {
              reject(xhr.response);
            }
          }
        };

        xhr.onerror = () => {
          reject();
        };

        xhr.open('POST', Endpoints.mobileAppUrl, true);
        let token = this.auth.accessToken.id;
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.send(formData);
      } catch (error) {
        reject(error);
      }
    });
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.mobileAppUrl}/${id}`;
    return this.http.delete(url,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(() => null);
  }

}
