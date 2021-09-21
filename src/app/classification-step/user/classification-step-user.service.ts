import {Headers, Http, URLSearchParams} from "@angular/http";
import {AuthService} from "../../auth/auth.service";
import {Endpoints} from "../../endpoints";
import {Page} from "../../shared/page/page";
import {ClassificationStepUser} from "./classification-step-user";
import {Injectable} from "@angular/core";

@Injectable()
export class ClassificationStepUserService {

  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http,
              private auth: AuthService) { }

  list() {
    return this.http.get(`${Endpoints.ClassificationStepUserUrl}`)
      .toPromise()
      .then(response => {
        return ClassificationStepUser.fromListData(response.json());
      });
  }

  listPaged(filter: any, page: Page<ClassificationStepUser>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('filter', filter ? filter : '');
    return this.http.get(`${Endpoints.ClassificationStepUserUrl}/paged`,
      {
        search: params,
      })
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = ClassificationStepUser.fromListData(page.data);
        return page;
      });
  }

  find(id: number | string) {
    let url = `${Endpoints.ClassificationStepUserUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        return ClassificationStepUser.fromData(response.json());
      });
  }

  save(classificationStepUser: ClassificationStepUser): Promise<ClassificationStepUser> {
    if (classificationStepUser.id) {
      return this.update(classificationStepUser);
    } else {
      return this.create(classificationStepUser);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.ClassificationStepUserUrl}/${id}`;
    return this.http.delete(url,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(() => null);
  }

  private create(classificationStepUser: ClassificationStepUser): Promise<ClassificationStepUser> {
    return this.http
      .post(Endpoints.ClassificationStepUserUrl, JSON.stringify(classificationStepUser),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => ClassificationStepUser.fromData(res.json()));
  }

  private update(classificationStepUser: ClassificationStepUser): Promise<ClassificationStepUser> {
    const url = `${Endpoints.ClassificationStepUserUrl}/${classificationStepUser.id}`;
    return this.http
      .put(url, JSON.stringify(classificationStepUser),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => ClassificationStepUser.fromData(res.json()));
  }

}
