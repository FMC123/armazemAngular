import { ErrorHandler } from '../shared/errors/error-handler';
import { Observable } from 'rxjs/Rx';

import { Autocomplete } from '../shared/forms/autocomplete/autocomplete';
import { DriverService } from './driver.service';

export class DriverAutocomplete extends Autocomplete {

  constructor(
    private driverService: DriverService,
    private errorHandler: ErrorHandler,
  ) {
    super('label', 10);
  }

  load(search: string) {
    return Observable.fromPromise(this.driverService.listDriverAutocomplete(search).catch((error) => this.errorHandler.fromServer(error)));
  }

}
