import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { Sample } from '../sample';
import { Endpoints } from '../../endpoints';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../user/user';
import { Batch } from '../../batch/batch';
import { TypeCoffee } from '../../pack-type/type-coffee';

@Injectable()
export class SampleHistoryService {
	private headers = new Headers({ 'Content-Type': 'application/json' });

	constructor(private http: Http, private auth: AuthService) {}

	listAll(sampleId: any): Promise<Array<Sample>> {
		return this.http
			.get(`${Endpoints.sampleUrl}/${sampleId}/audit`)
			.toPromise()
			.then(response => {
				return Sample.fromListData(response.json());
			});
	}
}
