import { PurchaseForecastFilter } from './purchase-forecast-list/purchase-forecast-filter';
import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';

import { AuthService } from '../auth/auth.service';
import { Endpoints } from '../endpoints';
import { Page } from '../shared/page/page';
import { PurchaseForecast } from './purchase-forecast';

@Injectable()
export class PurchaseForecastService {
	constructor(private http: Http, private auth: AuthService) {}

	listPagedWithStatus(
		filter: PurchaseForecastFilter,
		page: Page<PurchaseForecast>
	) {
		let params = new URLSearchParams();
		params.appendAll(page.toURLSearchParams());
		params.appendAll(filter.toURLSearchParams());
		return this.http
			.get(`${Endpoints.purchaseForecastUrl}/pagedStatus`, { search: params })
			.toPromise()
			.then(response => {
				page.setResultFromServer(response.json());
				page.data = PurchaseForecast.fromListData(page.data);
				return page;
			});
	}

	listPaged(filter: PurchaseForecastFilter, page: Page<PurchaseForecast>) {
		let params = new URLSearchParams();
		params.appendAll(page.toURLSearchParams());
		params.appendAll(filter.toURLSearchParams());
		return this.http
			.get(`${Endpoints.purchaseForecastUrl}/paged`, { search: params })
			.toPromise()
			.then(response => {
				page.setResultFromServer(response.json());
				page.data = PurchaseForecast.fromListData(page.data);
				return page;
			});
	}

	find(id: number | string) {
		let url = `${Endpoints.purchaseForecastUrl}/${id}`;
		return this.http
			.get(url)
			.toPromise()
			.then(response => PurchaseForecast.fromData(response.json()));
	}
}
