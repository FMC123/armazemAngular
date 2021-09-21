import { AuthService } from './../auth/auth.service';
import { Endpoints } from './../endpoints';
import { Page } from './../shared/page/page';
import { Certificate } from './certificate';
import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';

@Injectable()
export class CertificateService {
	private headers = new Headers({ 'Content-Type': 'application/json' });

	constructor(private http: Http, private auth: AuthService) {}

	listPaged(filter: any, page: Page<Certificate>) {
		let params = new URLSearchParams();
		params.appendAll(page.toURLSearchParams());
		params.append('search', filter ? filter : '');
		return this.http
			.get(`${Endpoints.certificateUrl}/paged`, {
				search: params
			})
			.toPromise()
			.then(response => {
				page.setResultFromServer(response.json());
				page.data = Certificate.fromListData(page.data);
				this.fillImageURLFromList(page.data);
				return page;
			});
	}

	list(): Promise<Array<Certificate>> {
		return this.http
			.get(Endpoints.operatorCertificateUrl)
			.toPromise()
			.then(response => {
				let list = Certificate.fromListData(response.json());
				this.fillImageURLFromList(list);
				return list;
			});
	}

	listWithoutImage(): Promise<Array<Certificate>> {
		return this.http
			.get(Endpoints.operatorCertificateUrl)
			.toPromise()
			.then(response => {
				let list = Certificate.fromListData(response.json());
				return list;
			});
	}

	find(id: number | string) {
		let url = `${Endpoints.certificateUrl}/${id}`;
		return this.http
			.get(url)
			.toPromise()
			.then(response => {
				let certificate = Certificate.fromData(response.json());
				this.fillImageURL(certificate);
				return certificate;
			});
	}

	saveWithFile(certificate: Certificate, file: any): Promise<Certificate> {
		return new Promise((resolve, reject) => {
			try {
				let formData: FormData = new FormData(),
					xhr: XMLHttpRequest = new XMLHttpRequest();

				if (certificate.id) {
					formData.append('id', certificate.id);
				}
        if (certificate.code) {
          formData.append('code', certificate.code);
        }
				if (certificate.name) {
					formData.append('name', certificate.name);
				}
				if (certificate.procafeCode) {
					formData.append('procafeCode', certificate.procafeCode);
				}
				if (file) {
					formData.append('file', file, file.name);
				}

				xhr.onreadystatechange = () => {
					if (xhr.readyState === 4) {
						if (xhr.status === 200) {
							resolve();
						} else {
							reject(JSON.parse(xhr.response));
						}
					}
				};

				xhr.onerror = () => {
					reject();
				};

				xhr.open('POST', Endpoints.certificateUrl, true);
				let token = this.auth.accessToken.id;
				xhr.setRequestHeader('Authorization', 'Bearer ' + token);
				xhr.send(formData);
			} catch (error) {
				reject(error);
			}
		});
	}

	delete(id: number | string): Promise<void> {
		let url = `${Endpoints.certificateUrl}/${id}`;
		return this.http
			.delete(url, {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(() => null);
	}

	private fillImageURLFromList(certificates: Array<Certificate>) {
		if (!certificates || certificates.length <= 0) {
			return;
		}
		certificates.forEach(certificate => {
			this.fillImageURL(certificate);
		});
	}

	public fillImageURL(certificate: Certificate) {
		if (certificate.id) {
			certificate.url =
				`${Endpoints.certificateImageUrl}/${certificate.id}?` +
				certificate.lastModified;
		}
	}

	loadCerticadefield(): Promise<boolean> {
		return Promise.resolve(this.auth.findParameterBoolean('CERTIFICATE_LOCK'));
	}

	loadBalanceFieldBlock(): Promise<boolean> {
		return Promise.resolve(
			this.auth.findParameterBoolean('BALANCE_FIELD_BLOCK')
		);
	}
}
