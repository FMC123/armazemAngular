import { ErrorHandler } from '../shared/errors/error-handler';
import { Autocomplete } from '../shared/forms/autocomplete/autocomplete';
import { Observable } from 'rxjs/Rx';
import { FarmService } from './farm.service';

export class FarmAutocomplete extends Autocomplete {

  constructor(
    private farmService: FarmService,
    private errorHandler: ErrorHandler,
  ) {
    super('label', 10);
  }

  load(search: string) {
    return Observable.fromPromise(this.farmService.autocomplete(search)
      .catch((error) => this.errorHandler.fromServer(error)));
  }
}