import { Endpoints } from '../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { AuthService } from '../auth/auth.service';
import { Page } from '../shared/page/page';
import { toPromise } from 'rxjs/operator/toPromise';
import {SamplePack} from "../sample-pack/sample-pack";

@Injectable()
export class SamplePackReceiveService {
	private headers = new Headers({ 'Content-Type': 'application/json' });

	constructor(private http: Http, private auth: AuthService) { }

	list(): Promise<Array<SamplePack>> {
		return this.http
			.get(`${Endpoints.samplePackUrl}/receive`)
			.toPromise()
			.then(response => {
				return SamplePack.fromListData(response.json());
			});
	}

	listPaged(filter: any, status: any, page: Page<SamplePack>) {
		const params = new URLSearchParams();
		params.appendAll(page.toURLSearchParams());
		params.append('filter', filter ? filter : '');
		params.append('status', status ? status : '');
    params.append('allwarehouses', 'true');
		return this.http
			.get(`${Endpoints.samplePackUrl}/paged`, {
				search: params
			})
			.toPromise()
			.then(response => {
				page.setResultFromServer(response.json());
				page.data = SamplePack.fromListData(page.data);
				return page;
			});
	}

	find(id: number | string) {
		const url = `${Endpoints.samplePackUrl}/${id}`;
		return this.http
			.get(url)
			.toPromise()
			.then(response => {
				const samplePack = SamplePack.fromData(response.json());

				return samplePack;
			});
	}

	receive(samplePack: SamplePack, accordance: boolean): Promise<SamplePack> {
		return this.receiveSamplePack(samplePack, accordance);
	}

	private receiveSamplePack(
		samplePack: SamplePack,
    accordance: boolean
	): Promise<SamplePack> {
		const params = new URLSearchParams();
		params.append('accordance', '' + accordance);

		const url = `${Endpoints.samplePackUrl}/receive`;
		return this.http
			.post(url, samplePack, {
				headers: this.auth.appendOrCreateAuthHeader(this.headers),
				search: params
			})

			.toPromise()
			.then(() => samplePack);
	}
}
