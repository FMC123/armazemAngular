import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { AuthService } from '../../auth/auth.service';
import { Notification } from '../notification';

@Injectable()
export class ErrorHandler {

  constructor(private auth: AuthService,
              private router: Router) {}

  fromServer(error): Promise<any> {
    if (error.status === 401 || error.status === 403) {
      this.auth.logoff();
      this.router.navigate(['']);
      return Promise.resolve('Não está autenticado.');
    }

    let message = this.errorMessageByStatus(error);
    Notification.error(message || 'Ocorreu um erro. Tente novamente mais tarde.');
    return Promise.reject(message);
  }

  errorMessageByStatus(error) {
    if (error.status === 0) {
      return 'Não foi possivel se comunicar com o servidor. Tente novamente mais tarde.';
    }
    if (error.json) {
      return error.json().message || error;
    }
    return error.message || error;
  }

}
