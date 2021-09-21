import { Endpoints } from '../../endpoints';
import { Injectable } from '@angular/core';
import {
  Http
} from '@angular/http';
import { NumberHelper } from 'app/shared/globalization/number-helper';
const FileSaver = require('file-saver');

@Injectable()
export class GlobalBatchesService {

  constructor(private http: Http) { }

  globalBatchesReport() {
    let url = `${Endpoints.globalBatchesReport}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => {
        let jsons = response.json();
        let csv =
          'ARMAZÉM:;' +
          'CÓDIGO CLIENTE/FAZENDA:;' +
          'CLIENTE:;' +
          'LOTE:;' +
          'PESO DO LOTE:\n';
        jsons.forEach(json => {
          csv =
            csv +
            json.warehouseName + ';' +
            (json.cooperatorCode ? json.cooperatorCode : '') + ';' +
            json.cooperatorName + ';' +
            json.batchCode + ';' +
            (json.batchTotal ? NumberHelper.toPTBR(json.batchTotal) : '0') + '\n';
        });
        FileSaver.saveAs(new Blob([csv], { type: "text/csv;charset=utf-8" }), 'GlobalBatchesReport.csv');
      });
  }
}