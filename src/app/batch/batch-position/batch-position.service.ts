import { Endpoints } from '../../endpoints';
import { AuthService } from '../../auth/auth.service';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { BatchPosition } from './batch-position';

@Injectable()
export class BatchPositionService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http: Http,
    private auth: AuthService,
  ) {}

  listActual() {
    return this.http.get(Endpoints.batchPositionUrl + '/actual')
      .toPromise()
      .then(response => {
        return BatchPosition.fromListData(response.json());
      });
  }
}
