import { ErrorHandler } from '../shared/errors/error-handler';
import { Observable } from 'rxjs/Rx';

import { Autocomplete } from '../shared/forms/autocomplete/autocomplete';
import { WarehouseStakeholderService } from './warehouse-stakeholder.service';

export class WarehouseStakeholderAutocomplete extends Autocomplete {

  constructor(
    private warehouseStakeholder: WarehouseStakeholderService,
    private errorHandler: ErrorHandler,
  ) {
    super('label', 10);
  }

  load(search: string) {
    return Observable.fromPromise(this.warehouseStakeholder.list(search).catch((error) => this.errorHandler.fromServer(error)));
  }

}
