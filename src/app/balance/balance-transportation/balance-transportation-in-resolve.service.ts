import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DateSyncService } from '../../date-sync/date-sync.service';
import { Transportation } from '../../transportation/transportation';
import {
    TransportationFiscalNoteCertificateService,
} from '../../transportation/transportation-fiscal-note/certificate/transportation-fiscal-note-certificate.service';
import {
    TransportationFiscalNoteService,
} from '../../transportation/transportation-fiscal-note/transportation-fiscal-note.service';
import { TransportationService } from '../../transportation/transportation.service';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class BalanceTransportationInResolve implements Resolve<Transportation> {

  constructor(
    private service: TransportationService,
    private fiscalNoteService: TransportationFiscalNoteService,
    private certificateService: TransportationFiscalNoteCertificateService,
    private dateSync: DateSyncService,
    private router: Router,
    private errorHandler: ErrorHandler,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {

    let id = route.params['id'];

    if (!id) {
      this.router.navigate(['/balance']);
      return;
    }

    return this.service.find(id).then((transportation: Transportation) => {

      if (transportation) {
        return this.fiscalNoteService.list(transportation.id).then(fiscalNotes => {
          transportation.fiscalNotes = fiscalNotes;
          let promises = [];

          transportation.fiscalNotes.forEach(fiscalNote => {

            promises.push(
              this.certificateService
                .list(transportation.id, fiscalNote.id)
                .then(certificates => {
                  fiscalNote.certificates = certificates;
                })
            );
          });

          return Promise.all(promises).then(() => {
            return transportation;
          });
        });
      } else {
        this.router.navigate(['/balance']);
        return null;
      }
    })
    .catch((error) => this.errorHandler.fromServer(error));
  }
}
