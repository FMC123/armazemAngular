
import { Injectable } from '@angular/core';
import { AuthService } from 'app/auth/auth.service';
import { Endpoints } from 'app/endpoints';
import { Headers, Http, ResponseContentType, URLSearchParams } from '@angular/http';
import {ClassifSpecialCoffee} from "./classif-special-coffee";
import {ClassifSpecialCoffeeFilter} from "./classif-special-coffee-filter";


@Injectable()
export class ClassifSpecialCoffeeService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private http: Http,
    private auth: AuthService) {
  }
  find(classifSpecialCoffeeFilter: ClassifSpecialCoffeeFilter): Promise<Blob> {
    let url = `${Endpoints.specialCoffeeReport}`;
    return this.http.post(
      url, JSON.stringify(classifSpecialCoffeeFilter),
      { headers: this.auth.appendOrCreateAuthHeader(this.headers), responseType: ResponseContentType.Blob }
    )
      .toPromise()
      .then(response => {
        return response.blob();
      });
  }

  findCsv(classifSpecialCoffeeFilter: ClassifSpecialCoffeeFilter): Promise<Array<ClassifSpecialCoffee>> {
    let url = `${Endpoints.specialCoffeeReportList}`;
    return this.http.post(
      url, JSON.stringify(classifSpecialCoffeeFilter),
      { headers: this.auth.appendOrCreateAuthHeader(this.headers), responseType: ResponseContentType.Json }
    )
      .toPromise()
      .then(response => {
        return ClassifSpecialCoffee.fromListData(response.json());
      });
  }


}
