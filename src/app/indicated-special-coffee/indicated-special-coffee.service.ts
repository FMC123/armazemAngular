import { Injectable } from '@angular/core';

import {Headers, Http, ResponseContentType, URLSearchParams} from '@angular/http';

import { AuthService } from './../auth/auth.service';
import { Endpoints } from './../endpoints';
import { Page } from './../shared/page/page';
import { ClassificationType } from '../classification/classification-type';
import { ClassificationVersion } from '../classification/classification-version';
import {User} from "../user/user";
import {UserService} from "../user/user.service";
import {ServiceInstructionListFilter} from "../service-instruction/service-instruction-list/service-instruction-list-filter";
import {ServiceInstruction} from "../service-instruction/service-instruction";
import {ClassificationVersionFilter} from "./indicated-special-coffee-list/classification-version-filter";
import {Batch} from "../batch/batch";
import {ClassificationProcessStatus} from "../classification/classification-process-status";

@Injectable()
export class IndicatedSpecialCoffeeService {
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
      .get(`${Endpoints.classificationVersionUrl}/pagedBySpecialCoffee`, { search: params })
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = ClassificationVersion.fromListData(page.data);
        return page;
      });
  }

  updateClassificationProcessStatus(classificationVersionId: string, classificationProcessStatus: ClassificationProcessStatus): Promise<ClassificationVersion> {
    let classificationVersion = new  ClassificationVersion();
    classificationVersion.id = classificationVersionId;
    classificationVersion.classificationProcessStatus = classificationProcessStatus.code;
    let url = `${Endpoints.classificationVersionUrl}/updateClassificationProcessStatus`;
    return this.http
      .put(url, JSON.stringify(classificationVersion), { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => ClassificationVersion.fromData(res.json()));
  }
}
