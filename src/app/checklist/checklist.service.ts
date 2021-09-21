import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import { Endpoints } from './../endpoints';
import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';
import {ChecklistType} from "./checklist-type";

@Injectable()
export class ChecklistService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http,
              private auth: AuthService) {}

  listTypes() : Promise<Array<ChecklistType>>{
    let params = new URLSearchParams();
    // params.append('search', search ? search : '');
    return this.http.get(
      `${Endpoints.checklisttypelist}`,
      { search: params }
    )
      .toPromise()
      .then(response => {
        if (!response.text()) {
          return [];
        }
        return ChecklistType.fromListData(response.json());
      });
  }
}
