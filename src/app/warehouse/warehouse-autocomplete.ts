import { ErrorHandler } from '../shared/errors/error-handler';
import { Observable } from 'rxjs/Rx';

import { Autocomplete } from '../shared/forms/autocomplete/autocomplete';
import {AuthService} from "../auth/auth.service";

export class WarehouseAutocomplete extends Autocomplete {

  constructor(
    private auth: AuthService,
    private errorHandler: ErrorHandler,
  ) {
    super('label', 10);
  }

  load(search: string) {
    return Observable.fromPromise(this.auth.listWarehousesAutocomplete(search).catch((error) => this.errorHandler.fromServer(error)));
  }

}
