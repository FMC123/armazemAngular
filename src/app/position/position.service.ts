import { AuthService } from './../auth/auth.service';
import { Endpoints } from './../endpoints';
import { Page } from './../shared/page/page';
import { Position } from './position';
import { PositionType } from './position-type';
import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';

@Injectable()
export class PositionService {
	private headers = new Headers({ 'Content-Type': 'application/json' });

	constructor(private http: Http, private auth: AuthService) { }

	listByWarehouseAndType(
		warehouseId: string,
		type?: PositionType,
		withSotageUnitBatches?: Boolean
	): Promise<Array<Position>> {
		let params = new URLSearchParams();

		if (type) {
			params.append('type', type.code);
		}

		if (withSotageUnitBatches != null) {
			params.append('withSotageUnitBatches', withSotageUnitBatches + '');
		}

		return this.http
			.get(Endpoints.positionsUrl(warehouseId), { search: params })
			.toPromise()
			.then(response => {
				return Position.fromListData(response.json());
			});
	}

	listPaged(
		warehouseId: string,
		filter: any,
		positionLayerId: string,
		page: Page<Position>
	) {
		let params = new URLSearchParams();
		params.appendAll(page.toURLSearchParams());
		params.append('search', filter ? filter : '');
		return this.http
			.get(`${Endpoints.positionsUrl(warehouseId)}/${positionLayerId}/paged`, {
				search: params
			})
			.toPromise()
			.then(response => {
				page.setResultFromServer(response.json());
				page.data = Position.fromListData(page.data);
				return page;
			});
	}

	find(warehouseId: string, positionId: number | string) {
		let url = `${Endpoints.positionsUrl(warehouseId)}/${positionId}`;
		return this.http
			.get(url)
			.toPromise()
			.then(response => Position.fromData(response.json()));
	}

	save(position: Position): Promise<Position> {
		if (position.id) {
			return this.update(position);
		} else {
			return this.create(position);
		}
	}

	delete(warwhouseId: string, id: number | string): Promise<void> {
		let url = `${Endpoints.positionsUrl(warwhouseId)}/${id}`;
		return this.http
			.delete(url, {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(() => null);
	}

	private create(position: Position): Promise<Position> {
		return this.http
			.post(
				Endpoints.positionsUrl(position.positionLayer.id),
				JSON.stringify(position),
				{ headers: this.auth.appendOrCreateAuthHeader(this.headers) }
			)
			.toPromise()
			.then(res => Position.fromData(res.json()));
	}

	private update(position: Position): Promise<Position> {
		const url = `${Endpoints.positionsUrl(position.positionLayer.id)}/${
			position.id
			}`;
		return this.http
			.put(url, JSON.stringify(position), {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(res => Position.fromData(res.json()));
	}

	activate(id: string): Promise<void> {
		const url = `${Endpoints.positionsUrl(
			this.auth.accessToken.warehouse.id
		)}/${id}/activate`;

		return this.http
			.put(url, null, {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(res => null);
	}

	deactivate(id: string): Promise<void> {
		const url = `${Endpoints.positionsUrl(
			this.auth.accessToken.warehouse.id
		)}/${id}/deactivate`;

		return this.http
			.put(url, null, {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(res => null);
	}
}
