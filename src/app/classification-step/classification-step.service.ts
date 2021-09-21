import {Injectable} from "@angular/core";
import {Http, URLSearchParams} from "@angular/http";
import {AuthService} from "../auth/auth.service";
import {Page} from "../shared/page/page";
import {ClassificationStep} from "./classification-step";
import {Endpoints} from "../endpoints";

@Injectable()
export class ClassificationStepService {

  constructor(private http: Http, private auth: AuthService) {}

  list(): Promise<Array<ClassificationStep>> {
    let params = new URLSearchParams();

    return this.http
      .get(`${Endpoints.ClassificationStepUrl}`, {
        search: params
      })
      .toPromise()
      .then(response => {
        return ClassificationStep.fromListData(response.json());
      });
  }

  listPaged(filter: any, page: Page<ClassificationStep>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('filter', filter ? filter : '');
    return this.http.get(`${Endpoints.ClassificationStepUrl}/paged`,
      {
        search: params,
      })
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = ClassificationStep.fromListData(page.data);
        return page;
      });
  }

  find(id: number | string) {
    let url = `${Endpoints.ClassificationStepUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        return ClassificationStep.fromData(response.json());
      });
  }

  save(ClassificationStep: ClassificationStep): Promise<ClassificationStep> {
    if (ClassificationStep.id) {
      return this.update(ClassificationStep);
    }else {
      return this.create(ClassificationStep);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.ClassificationStepUrl}/${id}`;
    return this.http.delete(url,
      {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  private create(ClassificationStep: ClassificationStep): Promise<ClassificationStep> {
    const url = `${Endpoints.ClassificationStepUrl}`;
    return this.http
      .post(url, JSON.stringify(ClassificationStep),
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json());
  }

  private update(ClassificationStep: ClassificationStep): Promise<ClassificationStep> {
    const url = `${Endpoints.ClassificationStepUrl}/${ClassificationStep.id}`;
    return this.http
      .put(url, JSON.stringify(ClassificationStep), {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json());
  }


}
