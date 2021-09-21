
import { Injectable } from '@angular/core';
import { Logger } from 'app/shared/logger/logger';
import { AuthService } from 'app/auth/auth.service';
import { Endpoints } from 'app/endpoints';
import { Headers, Http, ResponseContentType, URLSearchParams } from '@angular/http';
import { DuctClean } from 'app/report/duct-clean/duct-clean';


@Injectable()
export class DuctCleanService {
  private headers = new Headers({'Content-Type': 'application/json'});
  constructor(private http: Http,
              private auth: AuthService  ) {
  }
  find(ductClean: DuctClean): Promise<Blob> {
    let url = `${Endpoints.ductCleanReport}`;
    return this.http.post(
      url, JSON.stringify(ductClean),
      {headers: this.auth.appendOrCreateAuthHeader(this.headers), responseType: ResponseContentType.Blob}
    )
      .toPromise()
      .then(response => {
        return response.blob();
      });
  }
}



// { responseType: ResponseContentType.Blob },
