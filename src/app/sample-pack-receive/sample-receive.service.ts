import { Endpoints } from '../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { AuthService } from '../auth/auth.service';
import {Sample} from "../sample/sample";

@Injectable()
export class SampleReceiveService {
	private headers = new Headers({ 'Content-Type': 'application/json' });

	constructor(private http: Http, private auth: AuthService) { }

	listAll(packId: any): Promise<Array<Sample>> {
		const params = new URLSearchParams();
		params.append('packId', packId ? packId : '');

		return this.http
			.get(`${Endpoints.sampleUrl}`, {
				search: params
			})
			.toPromise()
			.then(response => {
				return Sample.fromListData(response.json());
			});
	}
}
