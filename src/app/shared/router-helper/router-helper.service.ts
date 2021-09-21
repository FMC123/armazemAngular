import { Injectable } from '@angular/core';
import {Router} from "@angular/router";

@Injectable()
export class RouterHelperService {

  urlHistory: Array<string>;

  constructor() {
    this.urlHistory = new Array<string>();
  }

  addUrl(router: Router): void {
    this.urlHistory.push(router.url);
    if (this.urlHistory.length > 10) {
      this.urlHistory.shift();
    }
  }

  getPreviousUrl(): string {
    return this.urlHistory.pop();
  }
}
