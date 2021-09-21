import {Injectable} from "@angular/core";
import {Headers, Http, URLSearchParams} from "@angular/http";
import {AuthService} from "../../auth/auth.service";
import {Endpoints} from "../../endpoints";
import {Page} from "../../shared/page/page";
import {ClassificationStepGroup} from "./classification-step-group";

@Injectable()
export class ClassificationStepGroupService {

  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http,
              private auth: AuthService) { }

  list() {
    return this.http.get(`${Endpoints.ClassificationStepGroupUrl}`)
      .toPromise()
      .then(response => {
        return ClassificationStepGroup.fromListData(response.json());
      });
  }

  listFilled() {
    return this.http.get(`${Endpoints.ClassificationStepGroupUrl}/list-filled`)
      .toPromise()
      .then(response => {
        return ClassificationStepGroup.fromListData(response.json());
      });
  }

  listPaged(filter: any, page: Page<ClassificationStepGroup>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('filter', filter ? filter : '');
    return this.http.get(`${Endpoints.ClassificationStepGroupUrl}/paged`,
      {
        search: params,
      })
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = ClassificationStepGroup.fromListData(page.data);
        return page;
      });
  }

  find(id: number | string) {
    let url = `${Endpoints.ClassificationStepGroupUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        let classificationStepGroup = ClassificationStepGroup.fromData(response.json());

        return classificationStepGroup;
      });
  }

  save(classificationStepGroup: ClassificationStepGroup): Promise<ClassificationStepGroup> {
    if (classificationStepGroup.id) {
      return this.update(classificationStepGroup);
    } else {
      return this.create(classificationStepGroup);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.ClassificationStepGroupUrl}/${id}`;
    return this.http.delete(url,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(() => null);
  }

  private create(classificationStepGroup: ClassificationStepGroup): Promise<ClassificationStepGroup> {
    return this.http
      .post(Endpoints.ClassificationStepGroupUrl, JSON.stringify(classificationStepGroup),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => ClassificationStepGroup.fromData(res.json()));
  }

  private update(classificationStepGroup: ClassificationStepGroup): Promise<ClassificationStepGroup> {
    const url = `${Endpoints.ClassificationStepGroupUrl}/${classificationStepGroup.id}`;
    return this.http
      .put(url, JSON.stringify(classificationStepGroup),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => ClassificationStepGroup.fromData(res.json()));
  }
}
