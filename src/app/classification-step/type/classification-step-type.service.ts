import {Headers, Http, URLSearchParams} from "@angular/http";
import {AuthService} from "../../auth/auth.service";
import {Endpoints} from "../../endpoints";
import {Page} from "../../shared/page/page";
import {ClassificationStep} from "../classification-step";
import {Injectable} from "@angular/core";

@Injectable()
export class ClassificationStepTypeService {

  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http,
              private auth: AuthService) { }

  list() {
    return this.http.get(`${Endpoints.ClassificationStepUrl}`)
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
        let classificationStep = ClassificationStep.fromData(response.json());

        return classificationStep;
      });
  }

  save(classificationStep: ClassificationStep): Promise<ClassificationStep> {
    if (classificationStep.id) {
      return this.update(classificationStep);
    } else {
      return this.create(classificationStep);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.ClassificationStepUrl}/${id}`;
    return this.http.delete(url,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(() => null);
  }

  private create(classificationStep: ClassificationStep): Promise<ClassificationStep> {
    return this.http
      .post(Endpoints.ClassificationStepUrl, JSON.stringify(classificationStep),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => ClassificationStep.fromData(res.json()));
  }

  private update(classificationStep: ClassificationStep): Promise<ClassificationStep> {
    const url = `${Endpoints.ClassificationStepUrl}/${classificationStep.id}`;
    return this.http
      .put(url, JSON.stringify(classificationStep),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => ClassificationStep.fromData(res.json()));
  }
}
