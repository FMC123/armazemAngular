
import { Injectable } from '@angular/core';
import { Logger } from 'app/shared/logger/logger';
import { AuthService } from 'app/auth/auth.service';
import { Endpoints } from 'app/endpoints';
import { Headers, Http, ResponseContentType, URLSearchParams } from '@angular/http';
import { DuctClean } from 'app/report/duct-clean/duct-clean';
import { Tag } from './tag';



@Injectable()
export class TagService {
  private headers = new Headers({'Content-Type': 'application/json'});
  constructor(private http: Http,
              private auth: AuthService  ) {
  }
  findNextTagOfWarehouse(): Promise<any> {
    let url = `${Endpoints.nextTagCodeUrl}`;


    return this.http.get(url)
    .toPromise()
    .then(response => {
      return Tag.fromData(response.json());
    });
  }
}
