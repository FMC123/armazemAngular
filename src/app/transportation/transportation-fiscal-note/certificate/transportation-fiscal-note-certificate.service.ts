import { Endpoints } from '../../../endpoints';
import { TransportationFiscalNoteCertificate } from './transportation-fiscal-note-certificate';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Parameter } from 'app/parameter/parameter';

@Injectable()
export class TransportationFiscalNoteCertificateService {

  constructor(
    private http: Http,
  ) { }

  list(transportationId: string, fiscalNoteId: string): Promise<Array<TransportationFiscalNoteCertificate>> {
    return this.http.get(Endpoints.transportationFiscalNoteCertificateUrl(transportationId, fiscalNoteId))
      .toPromise()
      .then(response => {
        return TransportationFiscalNoteCertificate.fromListData(response.json());
      });
  }


}
