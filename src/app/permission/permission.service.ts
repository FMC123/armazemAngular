import { Endpoints } from '../endpoints';
import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { Headers, Http, ResponseContentType, URLSearchParams } from '@angular/http';
import { DbGroup } from 'app/permission/dbGroup';

@Injectable()
export class PermissionService {
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http, private auth: AuthService) {

  }

  list(): Promise<Array<DbGroup>> {
    return this.http.get(Endpoints.permissionUrl)
      .toPromise()
      .then(response => {
        return DbGroup.fromListData(response.json());
      });
  }

  find(id: number | string) {
    let url = `${Endpoints.permissionUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        let group = DbGroup.fromData(response.json());
        return group;
      });
  }

  createNewGroup() {
    let url = `${Endpoints.permissionUrl}/createNewGroup`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        let group = DbGroup.fromData(response.json());
        return group;
      });
  }

  save(group: DbGroup): Promise<DbGroup> {
    if (group.id) {
      return this.update(group);
    } else {
      return this.create(group);
    }
  }

  delete(id: number | string): Promise<void> {
    let url = `${Endpoints.permissionUrl}/${id}`;
    return this.http.delete(
      url,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
    )
      .toPromise()
      .then(() => null);
  }

  private create(group: DbGroup): Promise<DbGroup> {
    return this.http
      .post(
      Endpoints.permissionUrl,
      group,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then(res => res.json().data);
  }

  private update(group: DbGroup): Promise<DbGroup> {
    const url = `${Endpoints.permissionUrl}/${group.id}`;
    return this.http
      .put(
      url,
      group,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) }
      )
      .toPromise()
      .then(() => group);
  }

}
