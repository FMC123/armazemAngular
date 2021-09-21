import { Injectable } from '@angular/core';

import { Headers, Http, URLSearchParams } from '@angular/http';

import { AuthService } from './../auth/auth.service';
import { Endpoints } from './../endpoints';
import { Page } from './../shared/page/page';
import { ClassificationType } from '../classification/classification-type';
import { ClassificationVersion } from '../classification/classification-version';

@Injectable()
export class ClassificationAuthorizationService {
	private headers = new Headers({ 'Content-Type': 'application/json' });

	constructor(private http: Http, private auth: AuthService) {}

	// listPaged(filter: any, page: Page<Classification>) {
	// 	const params = new URLSearchParams();
	// 	params.appendAll(page.toURLSearchParams());
	// 	params.append('search', filter ? filter : '');
	// 	return this.http
	// 		.get(`${Endpoints.classificationUrl}/paged`, { search: params })
	// 		.toPromise()
	// 		.then(response => {
	// 			page.setResultFromServer(response.json());
	// 			page.data = Classification.fromListData(page.data);
	// 			return page;
	// 		});
	// }

	listPaged(filter: any, page: Page<ClassificationVersion>) {
		const params = new URLSearchParams();
		params.appendAll(page.toURLSearchParams());
		params.append('search', filter ? filter : '');
		return this.http
			.get(`${Endpoints.classificationVersionUrl}/paged`, { search: params })
			.toPromise()
			.then(response => {
				page.setResultFromServer(response.json());
				page.data = ClassificationVersion.fromListData(page.data);
				return page;
			});
	}

	// list(): Promise<Array<Classification>> {
	// 	return this.http
	// 		.get(Endpoints.classificationUrl)
	// 		.toPromise()
	// 		.then(response => {
	// 			return Classification.fromListData(response.json());
	// 		});
	// }

	// find(id: number | string) {
	// 	const url = `${Endpoints.classificationUrl}/${id}`;
	// 	return this.http
	// 		.get(url)
	// 		.toPromise()
	// 		.then(response => {
	// 			const classification = Classification.fromData(response.json());
	// 			return classification;
	// 		});
	// }

	findVersion(id: number | string) {
		const url = `${Endpoints.classificationVersionUrl}/${id}`;
		return this.http
			.get(url)
			.toPromise()
			.then(response => {
				const classificationVersion = ClassificationVersion.fromData(
					response.json()
				);
				return classificationVersion;
			});
	}

	// save(classification: Classification): Promise<Classification> {
	// 	return this.http
	// 		.post(Endpoints.classificationUrl, classification, {
	// 			headers: this.auth.appendOrCreateAuthHeader(this.headers)
	// 		})
	// 		.toPromise()
	// 		.then(res => res.json().data);
	// }

	saveVersion(
		classificationVersion: ClassificationVersion
	): Promise<ClassificationVersion> {
		return this.http
			.put(
				Endpoints.classificationUrl + '/update-authorized-version',
				classificationVersion,
				{
					headers: this.auth.appendOrCreateAuthHeader(this.headers)
				}
			)
			.toPromise()
			.then(res => res.json().data);
	}

	updateStatus(
		classificationVersion: ClassificationVersion
	): Promise<ClassificationVersion> {
		return this.http
			.put(
				Endpoints.classificationUrl + '/update-status-version',
				classificationVersion,
				{
					headers: this.auth.appendOrCreateAuthHeader(this.headers)
				}
			)
			.toPromise()
			.then(res => res.json().data);
	}

	delete(id: number | string): Promise<void> {
		const url = `${Endpoints.classificationUrl}/${id}`;
		return this.http
			.delete(url, {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(() => null);
	}

	listTypes(): Promise<Array<ClassificationType>> {
		const url = `${Endpoints.classificationTypeUrl}/types`;
		return this.http
			.get(url)
			.toPromise()
			.then(response => {
				return ClassificationType.fromListData(response.json());
			});
	}
}
