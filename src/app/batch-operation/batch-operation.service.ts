import { BatchOperationFilter } from './batch-operation-list/batch-operation-filter';
import { Page } from '../shared/page/page';
import { Injectable } from '@angular/core';
import {
	Headers,
	Http,
	ResponseContentType,
	URLSearchParams
} from '@angular/http';

import { FiscalNote } from '../fiscal-note/fiscal-note';
import { AuthService } from './../auth/auth.service';
import { Endpoints } from './../endpoints';
import { BatchOperation } from './batch-operation';
import {Batch} from "../batch/batch";
import {BatchOperationOwnershipTransfer} from "./batch-operation-movement-form/batch-operation-ownership-transfer-form/batch-operation-ownership-transfer";

@Injectable()
export class BatchOperationService {
	private headers = new Headers({ 'Content-Type': 'application/json' });

	constructor(private http: Http, private auth: AuthService) {}

	listPaged(filter: BatchOperationFilter, page: Page<BatchOperation>) {
		let params = new URLSearchParams();
		params.appendAll(page.toURLSearchParams());
		params.appendAll(filter.toURLSearchParams());
		return this.http
			.get(`${Endpoints.batchOperationUrl}/paged`, { search: params })
			.toPromise()
			.then(response => {
				page.setResultFromServer(response.json());
				page.data = BatchOperation.fromListData(page.data);
				return page;
			});
	}

	find(id: string) {
		let url = `${Endpoints.batchOperationUrl}/${id}`;
		return this.http
			.get(url)
			.toPromise()
			.then(response => BatchOperation.fromData(response.json()));
	}

	createInBatchOperation(
		fiscalNotes: Array<FiscalNote>,
		auditorId: string,
    balanceWeightingMode
	): Promise<BatchOperation> {
		const url = `${Endpoints.batchOperationUrl}/in`;
		return this.http
			.post(
				url,
				JSON.stringify({
					listFiscalNote: fiscalNotes,
					auditor: { id: auditorId },
          balanceWeightingMode
				}),
				{ headers: this.auth.appendOrCreateAuthHeader(this.headers) }
			)
			.toPromise()
			.then(res => BatchOperation.fromData(res.json()));
	}

	isArmazemGeral(): boolean {
		let isArmazemGeral = this.auth.findParameterValue(
			'SERVICE_INSTRUCTION_FOR'
		);
		return isArmazemGeral !== null && isArmazemGeral === 'Armazém Geral';
	}

	update(batchOperations: Array<BatchOperation>): Promise<void> {
		const url = `${Endpoints.batchOperationUrl}`;
		return this.http
			.put(url, JSON.stringify(batchOperations), {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(() => {});
	}

	updateComplement(batchOperation: BatchOperation): Promise<BatchOperation> {
		const url = `${Endpoints.batchOperationUrl}/${batchOperation.id}`;
		return this.http
			.put(url, JSON.stringify(batchOperation), {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(() => this.find(batchOperation.id));
	}

	markInClosed(batchOperation: BatchOperation) {
		const url = `${Endpoints.batchOperationUrl}/${batchOperation.id}/in-close`;
		return this.http
			.put(url, null, {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(res => BatchOperation.fromData(res.json()));
	}

	markOutClosed(batchOperation: BatchOperation) {
		const url = `${Endpoints.batchOperationUrl}/${batchOperation.id}/out-close`;
		return this.http
			.put(url, null, {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(res => null);
	}

	delete(id: string): Promise<void> {
		let url = `${Endpoints.batchOperationUrl}/${id}`;
		return this.http
			.delete(url, {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(() => null);
	}

	downloadWeightTicket(id: string): Promise<void> {
		let params = new URLSearchParams();
		params.append('batchOperationId', id);
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

	downloadInternControl(id: string): Promise<void> {
		let params = new URLSearchParams();
		params.append('batchOperationId', id);
		return this.http
			.get(Endpoints.reportInternControlUrl, {
				responseType: ResponseContentType.Blob,
				search: params
			})
			.toPromise()
			.then(response => {
				let url = window.URL.createObjectURL(response.blob());
				window.open(url);
			});
	}

	relatorioEntradaRomaneio(batchOperationId: String): Promise<Blob> {
		let url = `${Endpoints.documentEntryReport}`;
		return this.http
			.get(`${url}/${batchOperationId}`, {
				headers: this.auth.appendOrCreateAuthHeader(this.headers),
				responseType: ResponseContentType.Blob
			})
			.toPromise()
			.then(response => {
				return response.blob();
			});
	}

	relatorioSaidaRomaneio(batchOperationId: String): Promise<Blob> {
		let url = `${Endpoints.documentExitReport}`;
		return this.http
			.get(`${url}/${batchOperationId}`, {
				headers: this.auth.appendOrCreateAuthHeader(this.headers),
				responseType: ResponseContentType.Blob
			})
			.toPromise()
			.then(response => {
				return response.blob();
			});
	}

	relatorioEntradaRomaneioPeso(batchOperationId: String): Promise<Blob> {
		let url = `${Endpoints.documentEntryWeightReport}`;
		return this.http
			.get(`${url}/${batchOperationId}`, {
				headers: this.auth.appendOrCreateAuthHeader(this.headers),
				responseType: ResponseContentType.Blob
			})
			.toPromise()
			.then(response => {
				return response.blob();
			});
	}

	saveMarkupGroup(batchOperation: BatchOperation) {
		const url = `${Endpoints.batchOperationUrl}/markup-group/${
			batchOperation.id
		}`;
		return this.http
			.put(url, JSON.stringify(batchOperation), {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(() => {});
	}

	deleteMarkupGroup(batchOperation: BatchOperation) {
		const url = `${Endpoints.batchOperationUrl}/markup-group/${
			batchOperation.id
		}`;
		return this.http
			.delete(url, {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(() => null);
	}

	reOpenBatchOperation(id: string) {
		const url = `${Endpoints.batchOperationUrl}/${id}/reopen`;
		return this.http
			.put(url, null, {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(res => null);
	}

	/**
	 * Para trocar opção de mostrar ou não em dispositivos móveis
	 *
	 * @param batchOperationId
	 * @param showOnMobileDevices
	 */
	switchShowOnMobile(
		batchOperationId: string,
		showOnMobileDevices: boolean
	): any {
		let url = `${
			Endpoints.batchOperationUrl
		}/${batchOperationId}/${showOnMobileDevices}`;
		return this.http
			.put(url, {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(() => null);
	}

  ownershipTransfer(batchOperationOwnershipTransfer:BatchOperationOwnershipTransfer): Promise<BatchOperationOwnershipTransfer> {

    return this.http
      .post(Endpoints.ownershipTransferUrl, JSON.stringify(batchOperationOwnershipTransfer),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => res.json());
  }

  ownershipTransferByList(batchsOperationOwnershipTransfer:  BatchOperationOwnershipTransfer[]): Promise<BatchOperationOwnershipTransfer[]> {

    return this.http
      .post(Endpoints.ownershipTransferByListUrl, JSON.stringify(batchsOperationOwnershipTransfer),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(res => res.json());
  }

  cancelOwnershipTransfer(batchOperationOwnershipTransfer:BatchOperationOwnershipTransfer): Promise<BatchOperation> {

    return this.http
      .post(Endpoints.ownershipTransferUrl, JSON.stringify(batchOperationOwnershipTransfer),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(() => null);
  }

  cancelOwnershipTransferByList(batchsOperationOwnershipTransfer:  BatchOperationOwnershipTransfer[]): Promise<BatchOperationOwnershipTransfer[]> {

    return this.http
      .post(Endpoints.ownershipTransferByListUrl, JSON.stringify(batchsOperationOwnershipTransfer),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(() => null);
  }

  listBalanceWeightingModes() {
    const url = `${Endpoints.batchOperationUrl}/list-balance-weighting-mode`;
    return this.http
      .get(url, {
        headers: this.auth.appendOrCreateAuthHeader(this.headers)
      })
      .toPromise()
      .then(res => res.json());
  }

  batchOperationPermissions(){
    return this.http
      .get(Endpoints.userMenusURL)
      .toPromise();
  }

  swapBatches(body) {
    return this.http
      .post(Endpoints.batchSwapUrl, JSON.stringify(body),
        { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
      .toPromise()
      .then(() => null);
  }
}
