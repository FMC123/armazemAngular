import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams, ResponseContentType } from '@angular/http';
import { Endpoints } from '../../endpoints';
import { FiscalNote } from '../../fiscal-note/fiscal-note';
import { AuthService } from '../../auth/auth.service';
import {SampleMovementHistory} from "../../sample/sample-movement-history";

@Injectable()
export class TransportationFiscalNoteService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private http: Http, private auth: AuthService) { }

  /**
   * Nota fiscal para adicionar certificado, para verificação de forma temporária,
   * para troca de dados entre componentes.
   */
  public static fiscalNoteToAddCertificate: FiscalNote = null;

  list(transportationId: string): Promise<Array<FiscalNote>> {
    return this.http
      .get(Endpoints.transportationFiscalNoteUrl(transportationId))
      .toPromise()
      .then(response => {
        return FiscalNote.fromListData(response.json());
      });
  }

  listFiscalNoteByBatchOperation(batchOperationId: string): Promise<Array<FiscalNote>> {
    return this.http
      .get(`${Endpoints.fiscalNoteUrl}/get-by-batch-operation/${batchOperationId}`)
      .toPromise().then(response => {
        return FiscalNote.fromListData(response.json());
      });
  }

  exists(code: string, idToIgnore: string, collaboratorId: string): Promise<boolean> {
    let params = new URLSearchParams();
    if (idToIgnore) {
      params.append('idToIgnore', idToIgnore);
    }
    if (collaboratorId) {
      params.append('collaboratorId', collaboratorId);
    }
    return this.http
      .get(`${Endpoints.fiscalNoteUrl}/${code}/exists`, { search: params })
      .toPromise()
      .then(response => {
        return response.text() === 'true';
      });
  }

  insert(fiscalNote: FiscalNote) {
    return this.http
    .post(`${Endpoints.fiscalNoteUrl}`, JSON.stringify(fiscalNote),
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
    .toPromise()
    .then(res => FiscalNote.fromData(res.json()));
  }

  update(fiscalNote: FiscalNote) {
    return this.http
    .put(`${Endpoints.fiscalNoteUrl}`, JSON.stringify(fiscalNote),
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
    .toPromise()
    .then(res => FiscalNote.fromData(res.json()));
  }

  remove(fiscalNote: FiscalNote) {
    return this.http
    .delete(`${Endpoints.fiscalNoteUrl}/${fiscalNote.id}`,
      { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
    .toPromise()
    .then(res => res);
  }

  replaceStakeholderForCollaborator(): Promise<boolean> {
    return Promise.resolve(
      this.auth.findParameterBoolean('COLLABORATOR_AT_FISCAL_NOTE_IN')
    );
  }

  invoiceFieldBlock(): Promise<boolean> {
    return Promise.resolve(
      this.auth.findParameterBoolean('INVOICE_FIELD_BLOCK')
    );
  }

  hiddenPurchaseFiled(): Promise<boolean> {
    return Promise.resolve(
      this.auth.findParameterBoolean('PURCHASE_FIELD')
    );
  }

  insertByBatchOperation(fiscalNote: FiscalNote) {
    return this.http
      .put(`${Endpoints.fiscalNoteUrl}/insert-by-batch-operation`, JSON.stringify(fiscalNote),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => null);
  }
}
