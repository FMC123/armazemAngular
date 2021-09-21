import { TransportationPurchaseForecastFiller } from './transportation-purchase-forecast-filler.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DateSyncService } from '../../date-sync/date-sync.service';
import { Transportation } from '../transportation';
import {
    TransportationFiscalNoteCertificateService,
} from '../transportation-fiscal-note/certificate/transportation-fiscal-note-certificate.service';
import { TransportationFiscalNoteService } from '../transportation-fiscal-note/transportation-fiscal-note.service';
import { TransportationService } from '../transportation.service';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class TransportationInFormResolve implements Resolve<Transportation> {
  constructor(
    private service: TransportationService,
    private fiscalNoteService: TransportationFiscalNoteService,
    private certificateService: TransportationFiscalNoteCertificateService,
    private dateSync: DateSyncService,
    private router: Router,
    private purchaseForecastFiller: TransportationPurchaseForecastFiller,
    private errorHandler: ErrorHandler
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      return this.dateSync.serverDate().then(arriveDate => {
        let transportation = Transportation.fromData({
          arriveDate
        });

        return this.purchaseForecastFiller
          .fill(transportation, route.queryParams['purchaseForecastId'])
          .then(() => {
            return transportation;
          });
      }).catch((error) => this.errorHandler.fromServer(error));
    }

    let id = route.params['id'];

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
            return this.purchaseForecastFiller
              .fill(transportation, route.queryParams['purchaseForecastId'])
              .then(() => {
                return transportation;
              });
          });
        }).catch((error) => this.errorHandler.fromServer(error));
      } else {
        this.router.navigate(['/lobby']);
        return null;
      }
    });
  }
}
