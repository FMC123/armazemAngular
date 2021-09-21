import {ErrorHandler} from '../shared/errors/error-handler';
import {Autocomplete} from '../shared/forms/autocomplete/autocomplete';
import {Observable} from 'rxjs/Rx';
import {SkuService} from "./sku.service";

export class SkuAutocomplete extends Autocomplete {

  id: string = null;

  constructor(
    private skuService: SkuService,
    private errorHandler: ErrorHandler,
  ) {
    super('label', 10);
  }

  load(search: string) {
    if(this.id){
      return Observable.fromPromise(this.skuService.list(search, this.id).catch((error) => {
        this.errorHandler.fromServer(error)
      }));
    }

    return Observable.fromPromise(this.skuService.list(search).catch((error) => {
      this.errorHandler.fromServer(error)
    }));
  }

  clean(el) {
    this.searchControl.setValue(null);
    this.select(null);
    this.valueChange.emit('');
    window.setTimeout(() => el.focus(), 0);
  }
}
