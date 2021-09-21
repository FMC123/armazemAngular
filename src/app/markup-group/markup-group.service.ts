import { MarkupGroup } from './markup-group';
import { AuthService } from '../auth/auth.service';
import { Endpoints } from '../endpoints';
import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { Position } from './../position/position';
import { BatchOperation } from 'app/batch-operation/batch-operation';
import { MarkupGroupBatch } from 'app/markup-group/batch/markup-group-batch';
import {Batch} from "../batch/batch";

@Injectable()
export class MarkupGroupService {
	private headers = new Headers({ 'Content-Type': 'application/json' });

	constructor(private http: Http, private auth: AuthService) {}

	sync(warehouseId: string, syncDate: number): Promise<any> {
		let params = new URLSearchParams();

		if (syncDate) {
			params.append('syncDate', syncDate + '');
		}

		params.append('warehouseId', this.auth.accessToken.warehouse.id);

		return this.http
			.get(Endpoints.markupGroupUrl + '/sync/all', { search: params })
			.toPromise()
			.then(response => {
				return MarkupGroup.fromListData(response.json());
			});
	}

	listWithBatchesInCommonWithShippingAuthorization(shippingAuthorizationId) {
		let params = new URLSearchParams();

		params.append('shippingAuthorizationId', shippingAuthorizationId);

		return this.http
			.get(
				Endpoints.markupGroupUrl +
					'/list-with-items-in-common-with-shipping-authorization',
				{ search: params }
			)
			.toPromise()
			.then(response => {
				return MarkupGroup.fromListData(response.json());
			});
	}

	listAtEndOfTheDay(warehouseId: string, day: number): Promise<any> {
		let params = new URLSearchParams();

		if (day) {
			params.append('day', day + '');
		}

		params.append('warehouseId', this.auth.accessToken.warehouse.id);

		return this.http
			.get(Endpoints.markupGroupUrl + '/list-at-end-of-the-day', {
				search: params
			})
			.toPromise()
			.then(response => {
				return MarkupGroup.fromListData(response.json());
			});
	}

	find(id: string): Promise<any> {
		return this.http
			.get(`${Endpoints.markupGroupUrl}/${id}`)
			.toPromise()
			.then(response => {
				return MarkupGroup.fromData(response.json());
			});
	}

	saveLabelAndColor(markupGroup: MarkupGroup): Promise<MarkupGroup> {
		const url = `${Endpoints.markupGroupUrl}/${markupGroup.id}/label-color`;
		return this.http
			.put(url, JSON.stringify(markupGroup), {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(res => null);
	}

	save(markupGroup: MarkupGroup): Promise<MarkupGroup> {
		if (markupGroup.id) {
			return this.update(markupGroup);
		} else {
			return this.create(markupGroup);
		}
	}

	delete(id: number | string): Promise<void> {
		let url = `${Endpoints.markupGroupUrl}/${id}`;
		return this.http
			.delete(url, {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(() => null);
	}

	private create(markupGroup: MarkupGroup): Promise<MarkupGroup> {
		return this.http
			.post(`${Endpoints.markupGroupUrl}`, JSON.stringify(markupGroup), {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(res => {
				markupGroup.id = res.json().id;
				markupGroup.lastModified = res.json().lastModified;
				markupGroup.createdDate = res.json().createdDate;
				return markupGroup;
			});
	}

	private update(markupGroup: MarkupGroup): Promise<MarkupGroup> {
		const url = `${Endpoints.markupGroupUrl}/${markupGroup.id}`;
		return this.http
			.put(url, JSON.stringify(markupGroup), {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(res => null);
	}

	moveAllMarkGroupBatch(
		batchOperation: BatchOperation,
		positionId: string
	): Promise<MarkupGroup> {
		const url = `${Endpoints.moveAllMarkGroupBatch(
			batchOperation.id,
			positionId
		)}`;
		return this.http
			.put(url, { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
			.toPromise()
			.then(res => null);
	}

	finishAllMarkGroupMatch(
		batchOperation: BatchOperation
	): Promise<MarkupGroupBatch> {
		const url = `${Endpoints.finishAllMarkGroupMatch(batchOperation.id)}`;
		return this.http
			.put(url, { headers: this.auth.appendOrCreateAuthHeader(this.headers) })
			.toPromise()
			.then(response => {
				return MarkupGroupBatch.fromData(response.json());
			});
	}

  listMarkupGroupBatchByBatchId(batchId: string){
    let params = new URLSearchParams();
    params.append('batchId', batchId ? batchId : '');

    return this.http.get(
      Endpoints.markupGroupBatchFindAllByBatchIdUrl,
      { search: params }
    )
      .toPromise()
      .then(response => {
        return MarkupGroupBatch.fromListData(response.json());
      });
  }

  reopenMarkupGroupBatch(markupGroupBatchId: string){
    let params = new URLSearchParams();
    // params.append('markupGroupBatchId', markupGroupBatchId ? markupGroupBatchId : '');
    return this.http.get(
      Endpoints.markupGroupBatchReopen + `/${markupGroupBatchId}`,
      { search: params }
    )
      .toPromise()
      .then(response => {
        console.log('Successo');
      }).catch();
  }

}
