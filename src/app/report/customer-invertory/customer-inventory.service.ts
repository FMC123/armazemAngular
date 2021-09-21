import { Headers, Http, ResponseContentType, URLSearchParams } from "@angular/http";
import { AuthService } from "../../auth/auth.service";
import { Endpoints } from "../../endpoints";
import { Injectable } from "@angular/core";
import { Batch } from "app/batch/batch";

@Injectable()
export class CustomerInventoryService {
	private headers = new Headers({ 'Content-Type': 'application/json' });
	constructor(private http: Http,
		private auth: AuthService) {
	}

	relatorioEstoqueCliente(personId: String): Promise<Blob> {
		let url = `${Endpoints.customerInventoryReport}`;
		return this.http.get(`${url}/${personId}`, {
			headers: this.auth.appendOrCreateAuthHeader(this.headers),
			responseType: ResponseContentType.Blob
		})
			.toPromise()
			.then(response => {
				return response.blob();
			});
	}

	relatorioEstoqueClienteLista(personId: String) {
		let url = `${Endpoints.customerInventoryReportList}`;
		return this.http.get(`${url}/${personId}`, {
			headers: this.auth.appendOrCreateAuthHeader(this.headers)
		})
			.toPromise()
			.then(response => {
				return Batch.fromListData(response.json());
			});
	}
}
