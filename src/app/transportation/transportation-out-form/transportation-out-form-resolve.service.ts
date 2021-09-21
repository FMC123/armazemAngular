import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DateSyncService } from '../../date-sync/date-sync.service';
import { Transportation } from '../transportation';
import { TransportationService } from '../transportation.service';
import { ErrorHandler } from 'app/shared/errors/error-handler';
import {TransportationFiscalNoteService} from "../transportation-fiscal-note/transportation-fiscal-note.service";

@Injectable()
export class TransportationOutFormResolve implements Resolve<Transportation> {
  constructor(
    private service: TransportationService,
    private fiscalNoteService: TransportationFiscalNoteService,
    private dateSync: DateSyncService,
    private router: Router,
    private errorHandler: ErrorHandler
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      return this.dateSync.serverDate().then(arriveDate => {
        let transportation = Transportation.fromData({
          arriveDate
        });
        return transportation;
      }).catch((error) => this.errorHandler.fromServer(error));
    }

    let id = route.params['id'];

    return this.service.find(id).then((transportation: Transportation) => {
      if (transportation) {
        return this.fiscalNoteService.list(transportation.id).then(fiscalNotes => {
          transportation.fiscalNotes = fiscalNotes;
          return transportation;
        }).catch((error) => this.errorHandler.fromServer(error));
      } else {
        this.router.navigate(['/lobby']);
        return null;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
