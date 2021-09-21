import { ErrorHandler } from '../shared/errors/error-handler';
import { Observable } from 'rxjs/Rx';
import { Autocomplete } from '../shared/forms/autocomplete/autocomplete';
import { CityService } from './city.service';

export class CityAutocomplete extends Autocomplete {

  constructor(
    private service: CityService,
    private errorHandler: ErrorHandler,
  ) {
    super('label', 10);
  }

  load(search: string) {
    return Observable.fromPromise(this.service.autoComplete(search).catch((error) => this.errorHandler.fromServer(error)));
  }
}