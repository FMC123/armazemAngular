import { BatchOperation } from './../batch-operation/batch-operation';
import { Batch } from '../batch/batch';
import { BatchWeight } from '../batch/batch-weight';
import { Scale } from '../scale/scale';
import { AuthService } from '../auth/auth.service';
import { BatchOperationWeight } from '../batch-operation/batch-operation-weight';
import { Endpoints } from '../endpoints';
import { BalanceWeight } from './balance-weight';
import { Position } from './../position/position';

import { Injectable } from '@angular/core';
import {
  Headers,
  Http,
  ResponseContentType,
  URLSearchParams
} from '@angular/http';
import {BalanceTransportationWeight} from "./balance-transportation/balance-transportation-weight";

@Injectable()
export class BalanceService {
  private headers = new Headers({ 'Content-Type': 'application/json' });

  weight: BalanceWeight = BalanceWeight.zero;
  scale: Scale;
  loading = false;

  constructor(private http: Http, private auth: AuthService) {
    this.auth.warehouseChange.subscribe(() => {
      this.scale = null;
    });
  }

  refreshWeight() {
    if (!this.scale) {
      throw new Error('Balança não vinculada');
    }

    if (this.loading) {
      return;
    }

    this.loading = true;
    let url = `${Endpoints.scaleIntegrationUrl}/${this.scale.id}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => {
        this.weight = BalanceWeight.fromData(response.json());
        this.loading = false;
      })
      .catch(error => {
        this.weight = new BalanceWeight(-1, false);
        this.loading = false;
      });
  }

  unifiedWithLobby() {
    return Promise.resolve(
      this.auth.findParameterBoolean('UNIFIED_LOBBY_BALANCE')
    );
  }

  weighingMode() {
    return Promise.resolve(
      this.auth.findParameterValue('BALANCE_WEIGHING_MODE')
    );
  }

  saveSacksQuantity(batchOperation: BatchOperation) {
    const url = `${Endpoints.batchOperationUrl}/sacks-quantity`;
    return this.http
      .put(url, JSON.stringify(batchOperation), {
        headers: this.auth.appendOrCreateAuthHeader(this.headers)
      })
      .toPromise()
      .then(res => BatchOperation.fromData(res.json()));
  }

  saveWeight(batchOperationWeight: BatchOperationWeight) {
    const url = `${Endpoints.batchOperationUrl}/weight`;
    return this.http
      .put(url, JSON.stringify(batchOperationWeight), {
        headers: this.auth.appendOrCreateAuthHeader(this.headers)
      })
      .toPromise()
      .then(res => BatchOperationWeight.fromData(res.json()));
  }

  saveBalanceTransportationWeight(balanceTransportationWeight: BalanceTransportationWeight) {
    const url = `${Endpoints.transportationUrl}/weight`;
    return this.http
      .put(url, JSON.stringify(balanceTransportationWeight), {
        headers: this.auth.appendOrCreateAuthHeader(this.headers)
      })
      .toPromise()
      .then(res => BalanceTransportationWeight.fromData(res.json()));
  }

  saveBatchWeight(batchWeight: BatchWeight) {
    const url = `${Endpoints.batchUrl(batchWeight.batch.batchOperation.id)}/${
      batchWeight.batch.id
      }/weight`;
    return this.http
      .put(url, JSON.stringify(batchWeight), {
        headers: this.auth.appendOrCreateAuthHeader(this.headers)
      })
      .toPromise()
      .then(res => Batch.fromData(res.json()));
  }

  saveNetQuantityValue(batch: Batch) {
    const url = `${Endpoints.batchUrl(batch.batchOperation.id)}/${
      batch.id
      }/net-quantity`;
    return this.http
      .put(url, JSON.stringify(batch), {
        headers: this.auth.appendOrCreateAuthHeader(this.headers)
      })
      .toPromise()
      .then(res => Batch.fromData(res.json()));
  }

  downloadWeightTicketIndividual(batchOperationId: string): Promise<void> {
    let params = new URLSearchParams();
    params.append('batchOperationId', batchOperationId);
    return this.http
      .get(Endpoints.reportWeightTicketIndividualUrl, {
        responseType: ResponseContentType.Blob,
        search: params
      })
      .toPromise()
      .then(response => {
        let url = window.URL.createObjectURL(response.blob());
        window.open(url);
      });
  }

  downloadInputFormTicket(batchOperationId: string): Promise<void> {
    let params = new URLSearchParams();
    params.append('batchOperationId', batchOperationId);
    return this.http
      .get(Endpoints.reportInputFormTicketUrl, {
        responseType: ResponseContentType.Blob,
        search: params
      })
      .toPromise()
      .then(response => {
        let url = window.URL.createObjectURL(response.blob());
        window.open(url);
      });
  }

  downloadWeightTicketGrouped(transportationId: string): Promise<void> {
    let params = new URLSearchParams();
    params.append('transportationId', transportationId);
    return this.http
      .get(Endpoints.reportWeightTicketGroupedUrl, {
        responseType: ResponseContentType.Blob,
        search: params
      })
      .toPromise()
      .then(response => {
        let url = window.URL.createObjectURL(response.blob());
        window.open(url);
      });
  }

  downloadWeightTicketPackagingOnly(transportationId: string): Promise<void> {
    let params = new URLSearchParams();
    params.append('transportationId', transportationId);
    return this.http
      .get(Endpoints.reportWeightTicketPackagingOnlyUrl, {
        responseType: ResponseContentType.Blob,
        search: params
      })
      .toPromise()
      .then(response => {
        let url = window.URL.createObjectURL(response.blob());
        window.open(url);
      });
  }

  downloadWeightTicketGroupedOut(transportationId: string): Promise<void> {
    let params = new URLSearchParams();
    params.append('transportationId', transportationId);
    return this.http
      .get(Endpoints.reportWeightTicketGroupedOutUrl, {
        responseType: ResponseContentType.Blob,
        search: params
      })
      .toPromise()
      .then(response => {
        let url = window.URL.createObjectURL(response.blob());
        window.open(url);
      });
  }

  downloadWeightTicketOutPackagingOnly(transportationId: string): Promise<void> {
    let params = new URLSearchParams();
    params.append('transportationId', transportationId);
    return this.http
      .get(Endpoints.reportWeightTicketOutPackagingOnlyUrl, {
        responseType: ResponseContentType.Blob,
        search: params
      })
      .toPromise()
      .then(response => {
        let url = window.URL.createObjectURL(response.blob());
        window.open(url);
      });
  }

	batchOperationMoveUrl(
		batchOperation: BatchOperation,
		batchId: string,
		positionId: string
	) {
		const url = `${Endpoints.batchOperationMoveUrl(
			batchOperation.id,
			batchId,
			positionId
		)}`;
		return this.http
			.post(url, { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
			.toPromise();
	}

  batchOperationMoveUrlOnlyMove(
    batchOperation: BatchOperation,
    batchId: string,
    positionId: string
  ): Promise<BatchOperation> {
    const url = `${Endpoints.batchOperationMoveUrlOnlyMove(
      batchOperation.id,
      batchId,
      positionId
    )}`;
    return this.http
      .post(url, { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => BatchOperation.fromData(res.json()));
  }

  batchOperationFinallyMove(
    batchOperation: BatchOperation,
    batchId: string,
    positionId: string,
    positionDestionation: Position
  ) {
    const url = `${Endpoints.batchOperationFinallyMoveWeb(
      batchOperation.id,
      batchId,
      positionId
    )}`;

    return this.http
      .post(url, positionDestionation, {
        headers: this.auth.appendOrCreateAuthHeader(this.headers)
      })
      .toPromise()
      .then(() => { });
  }

  printInternalOutputControl(transportationId: String):Promise<Blob> {
		let url = `${Endpoints.internalOutputControl}`;
		return this.http.get(`${url}/${transportationId}`, {
		  headers: this.auth.appendOrCreateAuthHeader(this.headers),
		  responseType: ResponseContentType.Blob
		})
		  .toPromise()
		  .then(response => {
			return response.blob();
		  });
	}
}
