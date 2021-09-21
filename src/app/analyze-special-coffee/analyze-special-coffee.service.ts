import { Injectable } from '@angular/core';

import {Headers, Http, ResponseContentType, URLSearchParams} from '@angular/http';

import { AuthService } from './../auth/auth.service';
import { Endpoints } from './../endpoints';
import { Page } from './../shared/page/page';
import { ClassificationVersion } from '../classification/classification-version';
import {ClassificationVersionFilter} from "./analyze-special-coffee-list/classification-version-filter";

@Injectable()
export class AnalyzeSpecialCoffeeService {
	private headers = new Headers({ 'Content-Type': 'application/json' });

	constructor(private http: Http,
              private auth: AuthService) {}

  listPaged(
    filter: ClassificationVersionFilter,
    page: Page<ClassificationVersion>
  ) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.appendAll(filter.toURLSearchParams());
    return this.http
      .get(`${Endpoints.classificationVersionUrl}/pagedBySpecialCoffeeAndSampleReceived`, { search: params })
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = ClassificationVersion.fromListData(page.data);
        return page;
      });
  }

  updateAnalyzeSpecialCoffee(classificationVersion: ClassificationVersion): Promise<ClassificationVersion> {
    let url = `${Endpoints.classificationVersionUrl}/updateAnalyzeSpecialCoffee`;
    return this.http
      .put(url, JSON.stringify(classificationVersion), { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => ClassificationVersion.fromData(res.json()));
  }

}
