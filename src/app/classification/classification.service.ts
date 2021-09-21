import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';

import { AuthService } from './../auth/auth.service';
import { Endpoints } from './../endpoints';
import { Page } from './../shared/page/page';
import { ClassificationType } from './classification-type';
import { ClassificationVersion } from './classification-version';
import {BatchOperationCertificate} from "../batch-operation/batch-operation-certificate/batch-operation-certificate";
import {ClassificationRequirementItem} from "./classification-requirement-item";

@Injectable()
export class ClassificationService {
	private headers = new Headers({ 'Content-Type': 'application/json' });

	constructor(private http: Http, private auth: AuthService) { }

	listPaged(filter: any, page: Page<ClassificationVersion>) {
		const params = new URLSearchParams();
		params.appendAll(page.toURLSearchParams());
		params.append('search', filter ? encodeURIComponent(filter) : '');
		return this.http
			.get(`${Endpoints.classificationUrl}/paged`, { search: params })
			.toPromise()
			.then(response => {
				page.setResultFromServer(response.json());
				page.data = ClassificationVersion.fromListData(page.data);
				return page;
			});
	}

	list(): Promise<Array<ClassificationVersion>> {
		return this.http
			.get(Endpoints.classificationUrl)
			.toPromise()
			.then(response => {
				return ClassificationVersion.fromListData(response.json());
			});
	}

	findVersion(id: number | string) {
		const url = `${Endpoints.classificationVersionUrl}/${id}`;
		return this.http
			.get(url)
			.toPromise()
			.then(response => {
				const classification = ClassificationVersion.fromData(response.json());
				return classification;
			});
	}

	findBySampleId(sampleId: number | string) {
		const url = `${Endpoints.classificationVersionUrl}/find-by-sample/${sampleId}`;
		return this.http
			.get(url)
			.toPromise()
			.then(response => {
				const classification = ClassificationVersion.fromData(response.json());
				return classification;
			});
	}

  findAuthorizedUntilDateBySampleId(sampleId: number | string, untilDate: number) {
    let params = new URLSearchParams();
    if (untilDate) {
      params.append('untilDate', untilDate + '');
    }
    return this.http
      .get(
        `${Endpoints.classificationVersionUrl}/find-by-sample/authorized-version-by-date/${sampleId}`,
        { search: params }
      )
      .toPromise()
      .then(response => {
        const classification = ClassificationVersion.fromData(response.json());
        return classification;
      });
  }

	listOldVersions(sampleId: number | string) {
		const url = `${Endpoints.classificationUrl}/sample/${sampleId}`;
		return this.http
			.get(url)
			.toPromise()
			.then(response => {
				return ClassificationVersion.fromListData(response.json())
			});

	}

	save(classificationVersion: ClassificationVersion): Promise<ClassificationVersion> {
		if (classificationVersion.id) {
			return this.update(classificationVersion);
		} else {
			return this.create(classificationVersion);
		}
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

  loadType(classificationTypeName: string): Promise<ClassificationType> {
    const url = `${Endpoints.classificationTypeUrl}/type/${classificationTypeName}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => {
        return ClassificationType.fromData(response.json());
      });
  }

	nextVersionByBarcode(barcode: string): Promise<number>{
    let codeEncoded = encodeURIComponent(barcode);
    let params = new URLSearchParams();
    params.append('barcode', barcode);
		const url = `${Endpoints.classificationVersionUrl}/next-by-barcode`;
		return this.http.get(
		  url,
      { search: params }
    )
      .toPromise()
			.then(response => {
				return response.json();
		});
	}

  getRequirements(): Promise<Array<ClassificationRequirementItem>> {
    return this.http
      .get(`${Endpoints.classificationUrl}/requirements`, {
        headers: this.auth.appendOrCreateAuthHeader(this.headers)
      })
      .toPromise()
      .then(res => res.json());
  }

	private create(classificationVersion: ClassificationVersion): Promise<ClassificationVersion> {
		return this.http
			.post(Endpoints.classificationUrl, classificationVersion, {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(res => res.json().data);
	}

	private update(classificationVersion: ClassificationVersion): Promise<ClassificationVersion> {
		return this.http
			.put(Endpoints.classificationUrl, classificationVersion, {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(res => res.json().data);
	}

	sync(warehouseId: string, syncDate: number): Promise<any>{
    let params = new URLSearchParams();
    params.append('warehouseId', warehouseId);
    if (syncDate) {
      params.append('syncDate', syncDate + '');
    }

    return this.http
      .get(
        Endpoints.classificationVersionUrl + '/sync/all',
        { search: params }
      )
      .toPromise()
      .then(response => {
        return ClassificationVersion.fromListData(response.json());
      });
  }

}
