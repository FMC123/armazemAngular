import { Injectable } from '@angular/core';
import { AuthService } from 'app/auth/auth.service';
import { Endpoints } from 'app/endpoints';
import { ReportFieldsInfo } from './report-fields-info';
import { Headers, Http } from '@angular/http';

@Injectable()
export class ReportFieldsInfoService {

	private headers = new Headers({ 'Content-Type': 'application/json' });

	constructor(private http: Http, private auth: AuthService) { }

	findByCompanyWarehouse(companyId: string, warehouseId?: string) {

		let url = `${Endpoints.reportFieldsInfoUrl}/${companyId}`;

		if (warehouseId != null && warehouseId != '') {
			url += '/' + warehouseId;
		}

		return this.http
			.get(url)
			.toPromise()
			.then(response => {
				return ReportFieldsInfo.fromData(response.json());
			});
	}

	saveWithFile(reportFieldsInfo: ReportFieldsInfo, file1x1?: any, file4x1?: any): Promise<ReportFieldsInfo> {

		return new Promise((resolve, reject) => {
			try {
				let formData: FormData = new FormData(),
					xhr: XMLHttpRequest = new XMLHttpRequest();

				if (reportFieldsInfo.id) {
					formData.append('id', reportFieldsInfo.id);
				}

				if (reportFieldsInfo.company) {
					formData.append('companyId', reportFieldsInfo.company.id);
				}

				if (reportFieldsInfo.warehouse) {
					formData.append('warehouseId', reportFieldsInfo.warehouse.id);
				}

				if (reportFieldsInfo.name) {
					formData.append('name', reportFieldsInfo.name);
				}

				if (reportFieldsInfo.cnpj) {
					formData.append('cnpj', reportFieldsInfo.cnpj);
				}

				if (reportFieldsInfo.stateRegistration) {
					formData.append('stateRegistration', reportFieldsInfo.stateRegistration);
				}

				if (reportFieldsInfo.phone) {
					formData.append('phone', reportFieldsInfo.phone);
				}

				if (reportFieldsInfo.address) {
					formData.append('address', reportFieldsInfo.address);
				}

				if (reportFieldsInfo.foundationInfo) {
					formData.append('foundationInfo', reportFieldsInfo.foundationInfo);
				}

        if (reportFieldsInfo.warehouseManager) {
          formData.append('warehouseManager', reportFieldsInfo.warehouseManager);
        }

        if (reportFieldsInfo.prosecutor) {
          formData.append('prosecutor', reportFieldsInfo.prosecutor);
        }

        if (reportFieldsInfo.endorsement) {
          formData.append('endorsement', reportFieldsInfo.endorsement);
        }

				if (file1x1) {
					formData.append('file1x1', file1x1, file1x1.name);
				}

				if (file4x1) {
					formData.append('file4x1', file4x1, file4x1.name);
				}

				if (reportFieldsInfo.removeLogo1x1 != null) {
					formData.append('removeLogo1x1', (reportFieldsInfo.removeLogo1x1) ? 'true' : 'false');
				}

				if (reportFieldsInfo.removeLogo4x1 != null) {
					formData.append('removeLogo4x1', (reportFieldsInfo.removeLogo4x1) ? 'true' : 'false');
				}

				xhr.onreadystatechange = () => {
					if (xhr.readyState === 4) {
						if (xhr.status === 200) {
							resolve();
						} else {
							reject(xhr.response);
						}
					}
				};

				xhr.onerror = () => {
					reject();
				};

				xhr.open('POST', Endpoints.reportFieldsInfoUrl, true);
				let token = this.auth.accessToken.id;
				xhr.setRequestHeader('Authorization', 'Bearer ' + token);
				xhr.send(formData);

			} catch (error) {
				reject(error);
			}
		});
	}

	delete(id: string): Promise<void> {
		let url = `${Endpoints.reportFieldsInfoUrl}/${id}`;
		return this.http.delete(url, {
			headers: this.auth.appendOrCreateAuthHeader(this.headers)
		}).toPromise().then(() => null);
	}
}
