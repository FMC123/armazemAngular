import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ErrorHandler } from '../shared/errors/error-handler';
import { Autocomplete } from '../shared/forms/autocomplete/autocomplete';
import { UserService } from 'app/user/user.service';

@Injectable()
export class UserAutocomplete extends Autocomplete {

  constructor(
    private userService: UserService,
    private errorHandler: ErrorHandler,
  ) {
    super('label', 10);
  }

  load(search: string) {
    return Observable.fromPromise(this.userService.listAutocomplete(search).catch((error) => this.errorHandler.fromServer(error)));
  }

  clean() {
    this.searchControl.setValue(null);
    this.select(null);
  }

}
