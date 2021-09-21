import { Injectable } from '@angular/core';
import { User } from '../../user/user';

@Injectable()
export class Logger {

  constructor() { }

  info(message: string, extra?: any) {
    if (!this.isInitied()) {
      this.init();
    }
    if (extra) {
      console.log(message, extra);
    } else {
      console.log(message);
    }
  }

  error(e: any) {
    if (!this.isInitied()) {
      this.init();
    }
    if (!e.message) {
      e = new Error(e);
    }
    console.error(e);
  }

  setUser(user: User) {
    // Not implemented yet
  }

  private isInitied() {
    return true;
  }

  private init() {
    // Not implemented yet
  }
}
