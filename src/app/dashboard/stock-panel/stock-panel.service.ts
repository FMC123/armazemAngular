import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { AuthService } from '../../auth/auth.service';
import { Endpoints } from '../../endpoints';
import { StockPanel } from './stock-panel';

@Injectable()
export class StockPanelService {
	private headers = new Headers({ 'Content-Type': 'application/json' });

	constructor(private http: Http, private auth: AuthService) {}

	load() {
		let url = `${Endpoints.stockPanelUrl}`;
		return this.http
			.get(url)
			.toPromise()
			.then(response => StockPanel.fromData(response.json()));
	}
}
