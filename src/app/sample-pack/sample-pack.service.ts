import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { AuthService } from './../auth/auth.service';
import { Page } from './../shared/page/page';
import { toPromise } from 'rxjs/operator/toPromise';
import { SamplePack } from './sample-pack';

@Injectable()
export class SamplePackService {
	private headers = new Headers({ 'Content-Type': 'application/json' });

	constructor(private http: Http, private auth: AuthService) {}

	list(): Promise<Array<SamplePack>> {
		return this.http
      .get(Endpoints.samplePackUrl)
			.toPromise()
			.then(response => {
				return SamplePack.fromListData(response.json());
			});
	}

	listPaged(filter: any, status: any, page: Page<SamplePack>) {
		let params = new URLSearchParams();
		params.appendAll(page.toURLSearchParams());
		params.append('filter', filter ? filter : '');
		params.append('status', status ? status : '');
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
		let url = `${Endpoints.samplePackUrl}/${id}`;
		return this.http
			.get(url)
			.toPromise()
			.then(response => {
				let samplePack = SamplePack.fromData(response.json());

				return samplePack;
			});
	}

	save(samplePack: SamplePack, send: boolean): Promise<SamplePack> {
		if (samplePack.id) {
			return this.update(samplePack, send);
		} else {
			return this.create(samplePack, send);
		}
	}

	private create(samplePack: SamplePack, send: boolean): Promise<SamplePack> {
		const url = `${Endpoints.samplePackUrl}`;
		let params = new URLSearchParams();
		params.append('send', '' + send);

		return this.http
			.post(url, JSON.stringify(samplePack), {
				headers: this.auth.appendOrCreateAuthHeader(this.headers),
				search: params
			})
			.toPromise()
			.then(res => res.json());
	}

	private update(samplePack: SamplePack, send: boolean): Promise<SamplePack> {
		let params = new URLSearchParams();
		params.append('send', '' + send);

		const url = `${Endpoints.samplePackUrl}/${samplePack.id}`;
		return this.http
			.put(url, samplePack, {
				headers: this.auth.appendOrCreateAuthHeader(this.headers),
				search: params
			})

			.toPromise()
			.then(() => samplePack);
	}
}
