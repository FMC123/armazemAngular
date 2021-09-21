import { Parameter } from './../parameter/parameter';
import { PackStockOwner } from './pack-stock-owner';
import { PackType } from '../pack-type/pack-type';
import { PackStockFilter } from './pack-stock-list/pack-stock-filter';
import { PackStockMovementGroup } from './pack-stock-movement-group';
import { Endpoints } from '../endpoints';
import { AuthService } from '../auth/auth.service';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { Page } from '../shared/page/page';
import { PackStockMovement } from './pack-stock-movement';
import { Injectable } from '@angular/core';

@Injectable()
export class PackStockService {
	private headers = new Headers({ 'Content-Type': 'application/json' });

	constructor(private http: Http, private auth: AuthService) {}

	listPaged(filter: PackStockFilter, page: Page<PackStockMovement>) {
		let params = new URLSearchParams();
		params.appendAll(page.toURLSearchParams());
		params.appendAll(filter.toURLSearchParams());
		return this.http
			.get(`${Endpoints.packStockMovementUrl}/paged`, { search: params })
			.toPromise()
			.then(response => {
				page.setResultFromServer(response.json());
				page.data = PackStockMovement.fromListData(page.data);
				return page;
			});
	}

	find(id: number | string) {
		let url = `${Endpoints.packStockMovementGroupUrl}/${id}`;
		return this.http
			.get(url)
			.toPromise()
			.then(response => {
				let group = PackStockMovementGroup.fromData(response.json());

				return this.http
					.get(`${url}/pack-stock-movement`)
					.toPromise()
					.then(response => {
						group.movements = PackStockMovement.fromListData(response.json());
						return group;
					});
			});
	}

	findByBatchOperation(id: number | string) {
		let url = `${Endpoints.packStockMovementGroupUrl}/batch-operation/${id}`;
		return this.http
			.get(url)
			.toPromise()
			.then(response => {
				if (!response.text()) {
					return null;
				}

				let group = PackStockMovementGroup.fromData(response.json());

				return this.http
					.get(
						`${Endpoints.packStockMovementGroupUrl}/${
							group.id
						}/pack-stock-movement`
					)
					.toPromise()
					.then(response => {
						group.movements = PackStockMovement.fromListData(response.json());
						return group;
					});
			});
	}

  findByFiscalNote(id: number | string) {
    let url = `${Endpoints.packStockMovementGroupUrl}/fiscal-note/${id}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => {
        if (!response.text()) {
          return null;
        }

        let group = PackStockMovementGroup.fromData(response.json());

        return this.http
          .get(
            `${Endpoints.packStockMovementGroupUrl}/${
              group.id
            }/pack-stock-movement`
          )
          .toPromise()
          .then(response => {
            group.movements = PackStockMovement.fromListData(response.json());
            return group;
          });
      });
  }

  save(group: PackStockMovementGroup): Promise<PackStockMovementGroup> {
		if (group.id) {
			return this.update(group);
		} else {
			return this.create(group);
		}
	}

	delete(id: number | string): Promise<void> {
		let url = `${Endpoints.packStockMovementGroupUrl}/${id}`;
		return this.http
			.delete(url, {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(() => null);
	}

	listOwnersAvailableForPackType(
		packTypeId: string,
		storageUnitIdToIgnore: string
	) {
		let url = `${
			Endpoints.packStockOwnerUrl
		}/available/pack-type/${packTypeId}`;

		let params = new URLSearchParams();
		params.append('storageUnitIdToIgnore', storageUnitIdToIgnore);

		return this.http
			.get(url, {
				search: params
			})
			.toPromise()
			.then(response => {
				return PackStockOwner.fromListData(response.json());
			});
	}

	private create(
		group: PackStockMovementGroup
	): Promise<PackStockMovementGroup> {
		return this.http
			.post(Endpoints.packStockMovementGroupUrl, group, {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(res => res.json().data);
	}

	private update(
		group: PackStockMovementGroup
	): Promise<PackStockMovementGroup> {
		const url = `${Endpoints.packStockMovementGroupUrl}/${group.id}`;
		return this.http
			.put(url, group, {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(() => group);
	}

	hiddenPackingData() {
		return Promise.resolve(this.auth.findParameterBoolean('HIDE_PACKING_DATA'));
	}
}
