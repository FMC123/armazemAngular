import { Endpoints } from '../endpoints';
import { Http, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import {isNumeric} from "rxjs/util/isNumeric";

@Injectable()
export class DateSyncService {
  constructor(private http: Http) { }

  public serverDate(): Promise<any> {
    let params = new URLSearchParams();
    return this.http.get(Endpoints.dateSyncUrl,
                      {
                        search: params
                      })
                      .toPromise()
                      .then(response => {
                        if(isNumeric(response)) return +response.json().date;
                        else{
                          return new Date(response.json().date);
                        }
                      });
  }

}
