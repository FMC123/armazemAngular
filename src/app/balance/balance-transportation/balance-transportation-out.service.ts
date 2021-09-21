import { ErrorHandler } from '../../shared/errors/error-handler';
import { Router } from '@angular/router';
import { BatchOperationService } from '../../batch-operation/batch-operation.service';
import {
  TransportationFiscalNoteService,
} from '../../transportation/transportation-fiscal-note/transportation-fiscal-note.service';
import { AuthService } from '../../auth/auth.service';
import { Transportation } from '../../transportation/transportation';

import { Injectable } from '@angular/core';

@Injectable()
export class BalanceTransportationOutService {

  loading = false;

  weighingMode: string;
  transportation: Transportation;

  constructor(
    private auth: AuthService,
    private router: Router,
    private batchOperationService: BatchOperationService,
    private errorHandler: ErrorHandler,
  ) { }


  get batchOperationOut() {
    return this.transportation.batchOperationOut;
  }

  get allowManualWeighing() {
    return this.auth.authenticated && (this.auth.accessToken.leader || this.auth.accessToken.admin);
  }


}
