import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { Endpoints } from './../endpoints';
import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';


@Injectable()
export class VehiclePlateService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  search(search: any, which: number) {
    let params = new URLSearchParams();
    params.append('search', search ? search : '');
    return this.http.get(
      `${Endpoints.vehiclePlateUrl}/${which}`,
      { search: params }
    )
      .toPromise()
      .then(response => {
        if (!response.text()) {
          return [];
        }

        return response.json();
      });
  }
}
