import {Autocomplete} from "../shared/forms/autocomplete/autocomplete";
import {ErrorHandler} from "../shared/errors/error-handler";
import {Observable} from "rxjs";
import {SampleService} from "./sample.service";

export class SampleFilterAutocomplete extends Autocomplete {

  constructor(
    private sampleService: SampleService,
    private errorHandler: ErrorHandler,
  ) {
    super(null, 10);
  }

  load(search: string) {
    return Observable.fromPromise(this.sampleService.search(search, false).catch((error) => this.errorHandler.fromServer(error)));
  }
}
