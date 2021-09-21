import { ErrorHandler } from '../shared/errors/error-handler';
import { Observable } from 'rxjs/Rx';

import { Autocomplete } from '../shared/forms/autocomplete/autocomplete';
import { SampleTrackingService } from './sample-tracking.service';

export class SampleTrackingAutocomplete extends Autocomplete {

  constructor(
    private sampleTrackingService: SampleTrackingService,
    private errorHandler: ErrorHandler,
  ) {
    super('description', 10);
  }

  load(search: string) {
    return Observable.fromPromise(
      this.sampleTrackingService.listAutocomplete(search).catch(
        (error) => this.errorHandler.fromServer(error))
    );
  }
}