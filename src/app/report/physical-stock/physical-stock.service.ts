import { AuthService } from '../../auth/auth.service';
import { Endpoints } from '../../endpoints';
import { Page } from '../../shared/page/page';
import { Injectable } from '@angular/core';
import {
	Headers,
	Http,
	ResponseContentType,
	URLSearchParams
} from '@angular/http';
import { print } from '@angular/core/src/facade/lang';
import { Array } from 'core-js/library/web/timers';
import { BatchOperationStatus } from '../../batch-operation/batch-operation-status';
const FileSaver = require('file-saver');

@Injectable()
export class PhysicalStockService {
	private headers = new Headers({ 'Content-Type': 'application/json' });

	constructor(private http: Http, private auth: AuthService) { }

	find() {
		let url = `${Endpoints.physicalStock}`;
		return this.http
			.get(url, { responseType: ResponseContentType.Blob })
			.toPromise()
			.then(response => {
				let url = window.URL.createObjectURL(response.blob());
				window.open(url);
			});
	}

	findCsv() {
		let url = `${Endpoints.physicalStockCollaborator}`;
		return this.http
			.get(url)
			.toPromise()
			.then(response => {
				let jsons = response.json();
				let csv = 'CLIENTE;LOTE;BAG;PESO ENTRADA;POSIÇÃO\n';

				jsons.forEach(json => {
					json.batchOperations.forEach(batchOperation => {
						batchOperation.batches.forEach(batch => {
							batch.storageUnits.forEach(storage => {

								let quantity = (storage.quantity != null)
									? (storage.quantity.toString().replace('.', ','))
									: '';

								csv += storage.personName + ';' +
									storage.batchCode + ';' +
									storage.tagCode + ';' +
									quantity + ';' +
									storage.positionCode + ' - ' + storage.stackCode + '/' + storage.stackHeight + '\n';
							});
						});
					});
				});
				FileSaver.saveAs(new Blob([csv], { type: "text/csv;charset=utf-8" }), 'Report.csv');
			});
	}

	globalBagsReport() {
		let url = `${Endpoints.globalBagsReport}`;
		return this.http
			.get(url)
			.toPromise()
			.then(response => {
				let jsons = response.json();
				let csv =
					'LOTE: ' +
					';' +
					'STATUS: ' +
					';' +
					'CLIENTE:' +
					';' +
					'POSICAO ATUAL:' +
					';' +
					'TAG:' +
					';' +
					'PESO DA BAG: \n';
				jsons.forEach(json => {
					const collaborator = [json.collaboratorCode, json.collaboratorName]
						.filter(i => !!i)
						.join(' - ');
					csv =
						csv +
						json.batchCode +
						';' +
						BatchOperationStatus.fromData(json.status).name +
						';' +
						collaborator +
						';' +
						json.positionCode +
						';' +
						json.tagCode +
						';' +
						json.quantity +
						'\n';
				});
				FileSaver.saveAs(new Blob([csv], { type: "text/csv;charset=utf-8" }), 'Report.csv');
			});
	}

	makeDocXLS(stringJson: string) {
		return;
	}
}
