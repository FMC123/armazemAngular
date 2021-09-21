import { Endpoints } from '../endpoints';
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { AuthService } from '../auth/auth.service';
import { Page } from '../shared/page/page';
import { toPromise } from 'rxjs/operator/toPromise';
import { SamplePack } from '../sample-pack/sample-pack';
import { Sample } from './sample';
import { User } from '../user/user';
import { SampleListFilter } from './sample-list/sample-list-filter';
import { Batch } from '../batch/batch';
import { TypeCoffee } from '../pack-type/type-coffee';
import {MarkupGroupBatch} from "../markup-group/batch/markup-group-batch";
import {SampleMovementHistory} from "./sample-movement-history";

@Injectable()
export class SampleService {
	private headers = new Headers({ 'Content-Type': 'application/json' });

	constructor(private http: Http, private auth: AuthService) {}

	listAllPending(packId: any): Promise<Array<Sample>> {
		let params = new URLSearchParams();
		params.append('packId', packId ? packId : '');

		return this.http
			.get(`${Endpoints.samplePendingUrl}`, {
				search: params
			})
			.toPromise()
			.then(response => {
				return Sample.fromListData(response.json());
			});
	}

	listAll(packId: any): Promise<Array<Sample>> {
		let params = new URLSearchParams();
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

	search(search: any, onlyReceived: boolean) {
		let params = new URLSearchParams();
		params.append('search', search ? search : '');
		params.append('onlyreceived', onlyReceived ? "true" : "false");
		return this.http
			.get(`${Endpoints.sampleUrl}/search`, { search: params })
			.toPromise()
			.then(response => {
				if (!response.text()) {
					return [];
				}

				return response.json();
			});
	}

  findByBarCode(barcode: string) {
    let params = new URLSearchParams();
    params.append('barcode', barcode);

    return this.http
      .get(`${Endpoints.sampleUrl}/getbarcode`, { search: params })
      .toPromise()
      .then(response => {
        return Sample.fromData(response.json());
      });
  }

	findByBarCodeDischarge(barcode: string) {
		let params = new URLSearchParams();
		params.append('barcode', barcode);

		return this.http
			.get(`${Endpoints.sampleUrl}/find-barcode-discharge`, { search: params })
			.toPromise()
			.then(response => {
				return Sample.fromData(response.json());
			});
	}

	findByBarCodeWithdrawal(barcode: string) {
		let params = new URLSearchParams();
		params.append('barcode', barcode);

		return this.http
			.get(`${Endpoints.sampleUrl}/find-barcode-withdrawal`, { search: params })
			.toPromise()
			.then(response => {
				return Sample.fromData(response.json());
			});
	}

	findByBarCodeDevolution(barcode: string) {
		let params = new URLSearchParams();
		params.append('barcode', barcode);

		return this.http
			.get(`${Endpoints.sampleUrl}/find-barcode-devolution`, { search: params })
			.toPromise()
			.then(response => {
				return Sample.fromData(response.json());
			});
	}

	discharge(samples: Array<Sample>, userId: string, password: string) {
		return this.http
			.post(`${Endpoints.sampleUrl}/discharge`, {
				samples: samples,
				userId: userId,
				password: password
			})
			.toPromise();
	}

	withdrawal(
		samples: Array<Sample>,
		userId: string,
		responsibleId: string,
		password: string
	) {
		return this.http
			.post(`${Endpoints.sampleUrl}/withdrawal`, {
				samples: samples,
				userId: userId,
				responsibleId: responsibleId,
				password: password
			})
			.toPromise();
	}

	find(id: string) {
		return this.http
			.get(`${Endpoints.sampleUrl}/${id}`)
			.toPromise()
			.then(response => {
				return Sample.fromData(response.json());
			});
	}

	listPaged(filter: SampleListFilter, page: Page<Sample>) {
		let params = new URLSearchParams();
		params.appendAll(page.toURLSearchParams());
		params.appendAll(filter.toURLSearchParams());
		return this.http
			.get(`${Endpoints.sampleUrl}/paged`, { search: params })
			.toPromise()
			.then(response => {
				page.setResultFromServer(response.json());
				page.data = Sample.fromListData(page.data);
				return page;
			});
	}

	devolution(samples: Array<Sample>, userId: string, password: string) {
		return this.http
			.post(`${Endpoints.sampleUrl}/devolution`, {
				samples: samples,
				userId: userId,
				password: password
			})
			.toPromise();
	}

  findByBatchId(batchId: string){
    let params = new URLSearchParams();
    params.append('batchId', batchId ? batchId : '');

    return this.http.get(
      Endpoints.sampleFindByBatchIdUrl,
      { search: params }
    )
      .toPromise()
      .then(response => {
        return Sample.fromData(response.json());
      });
  }

  listForPicoteRequestPaged(filter: SampleListFilter, page: Page<Sample>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.appendAll(filter.toURLSearchParams());
    return this.http
      .get(`${Endpoints.sampleUrl}/paged-for-picote-request`, { search: params })
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = Sample.fromListData(page.data);
        return page;
      });
  }

  listPagedArchive(filter: SampleListFilter, page: Page<Sample>) {
    let params = new URLSearchParams();
    params.appendAll(page.toURLSearchParams());
    params.appendAll(filter.toURLSearchParams());
    return this.http
      .get(`${Endpoints.sampleUrl}/paged-archive`, { search: params })
      .toPromise()
      .then(response => {
        page.setResultFromServer(response.json());
        page.data = Sample.fromListData(page.data);
        return page;
      });
  }
}
