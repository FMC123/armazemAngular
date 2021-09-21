import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';
import { Department } from './department';

@Injectable()
export class DepartmentService {
	private headers = new Headers({ 'Content-Type': 'application/json' });

	constructor(private http: Http, private auth: AuthService) {}

	list(): Promise<Array<Department>> {
		let params = new URLSearchParams();

		return this.http
			.get(`${Endpoints.departmentUrl}`, {
				search: params
			})
			.toPromise()
			.then(response => {
				return Department.fromListData(response.json());
			});
	}

  listPaged(filter: any, page: Page<Department>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.append('filter', filter ? filter : '');
    return this.http.get(`${Endpoints.departmentUrl}/paged`,
      {
        search: params,
      })
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = Department.fromListData(page.data);
        return page;
      });
  }

  find(id: number | string) {
    let url = `${Endpoints.departmentUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        let department = Department.fromData(response.json());

        return department;
      });
  }

  save(department: Department): Promise<Department> {
    if (department.id) {
      return this.update(department);
    }else {
      return this.create(department);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.departmentUrl}/${id}`;
    return this.http.delete(url,
      {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(() => null);
  }

  private create(department: Department): Promise<Department> {
    const url = `${Endpoints.departmentUrl}`
    return this.http
      .post(url, JSON.stringify(department),
        {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json());
  }

  private update(department: Department): Promise<Department> {
    const url = `${Endpoints.departmentUrl}/${department.id}`;
    return this.http
      .put(url, JSON.stringify(department), {headers: this.auth.appendOrCreateAuthHeader(this.headers)})
      .toPromise()
      .then(res => res.json());
  }
}
