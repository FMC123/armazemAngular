import { Injectable } from '@angular/core';

import { Certificate } from '../../../certificate/certificate';
import { FiscalNote } from '../../../fiscal-note/fiscal-note';

export class TransportationFiscalNoteCertificate {

  tempId: string;

  static fromListData(listData: Array<TransportationFiscalNoteCertificate>): Array<TransportationFiscalNoteCertificate> {
    return listData.map((data) => {
      return TransportationFiscalNoteCertificate.fromData(data);
    });
  }

  static fromData(data: any): TransportationFiscalNoteCertificate {
    if (!data) return new this();
    let transportation = new this(
      data.id,
      data.certifiedCustodyCode,
      data.certifiedOriginCode,
      data.certificate,
      data.fiscalNote,
    );
    return transportation;
  }

  constructor(
    public id?: string,
    public certifiedCustodyCode?:  string,
    public certifiedOriginCode?: string,
    public certificate?: Certificate,
    public fiscalNote?: FiscalNote,
  ) {
    if (certificate) {
      this.certificate = Certificate.fromData(certificate);
    }

    if (fiscalNote) {
      this.fiscalNote = FiscalNote.fromData(fiscalNote);
    }
  }

}
