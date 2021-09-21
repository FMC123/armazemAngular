import { Component, OnInit, Input } from '@angular/core';
import { errorHandler } from '@angular/platform-browser/src/browser';

import { ErrorHandler } from '../../shared/errors/error-handler';
import { NumberHelper } from '../../shared/globalization';
import { Logger } from '../../shared/logger/logger';
import { Notification } from '../../shared/notification';
import { StorageUnitOutService } from '../../storage-unit/out/storage-unit-out.service';
import { StorageUnitOut } from '../../storage-unit/out/storage-unit-out';
import { BatchReportService } from '../batch-report.service';
import { BatchReportOutLine } from './batch-report-out-line';
import { BatchOperationType } from 'app/batch-operation/batch-operation-type';
import { BatchReportComponent } from '../batch-report.component';
import {Batch} from "../../batch/batch";
import {KilosSacksConverterService} from "../../shared/kilos-sacks-converter/kilos-sacks-converter.service";

@Component({
  selector: 'app-batch-report-out',
  templateUrl: 'batch-report-out.component.html'
})

export class BatchReportOutComponent implements OnInit {
  @Input() parent: BatchReportComponent;
  @Input() batch: Batch;
  loading: boolean;
  storageUnitOuts: Array<StorageUnitOut>;
  listagemSaidas: Array<BatchReportOutLine>;

  constructor(
    private componentService: BatchReportService,
    private serverService: StorageUnitOutService,
    private errorHandler: ErrorHandler,
    private logger: Logger,
    private kilosSacksConverterService: KilosSacksConverterService,
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.loadList();
  }

  loadList() {
    this.loading = true;
    this.serverService.listByBatch(this.batch.id).then((storageUnitOuts) => {
      this.storageUnitOuts = storageUnitOuts;
      this.loading = false;
      this.fazerOrdencaoPorTipoOperacao();
    }).catch(error => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  get totalQuantity() {
    if (!this.storageUnitOuts) {
      return 0;
    }

    return this.storageUnitOuts
      .map((su) => su.quantity)
      .reduce((a, b) => a + b, 0);
  }

  get totalQuantityString() {
    return NumberHelper.toPTBR(this.totalQuantity);
  }

  /**
   * Faz ordenação dos registros de saída por batch operation
   */
  fazerOrdencaoPorTipoOperacao() {

    this.listagemSaidas = new Array<BatchReportOutLine>();
    if (this.storageUnitOuts && this.storageUnitOuts.length > 0) {

      this.storageUnitOuts.forEach(out => {

        // verifica se já existe id no novo array
        let objSaida: BatchReportOutLine = null;
        let indice = null;

        if (this.listagemSaidas && this.listagemSaidas.length > 0) {
          for (let i = 0; i < this.listagemSaidas.length; i++) {
            if (this.listagemSaidas[i].batchOperationId == out.markupGroupBatch.markupGroup.batchOperation.id) {
              objSaida = this.listagemSaidas[i];
              indice = i;
              break;
            }
          }
        }

        // se não existe cria o tipo, senão atualiza
        if (objSaida == null) {
          objSaida = new BatchReportOutLine();
          objSaida.batchOperationId = out.markupGroupBatch.markupGroup.batchOperation.id;
          objSaida.batchOperationType = out.markupGroupBatch.markupGroup.batchOperation.type;
          objSaida.batchOperationName = new BatchOperationType(out.markupGroupBatch.markupGroup.batchOperation.type).name;
          objSaida.storageUnitOuts = new Array<StorageUnitOut>();
          objSaida.storageUnitOuts.push(out);
          this.listagemSaidas.push(objSaida);
        }
        else {
          objSaida.storageUnitOuts.push(out);
          this.listagemSaidas[indice] = objSaida;
        }

      });
    }
  }

  /**
   * Calcula o total de sacas para a lista de saídas
   * @param outs
   */
  calcularTotalSacas(outs: Array<StorageUnitOut>) {

    let total = 0;

    if (outs && outs.length > 0) {
      outs.forEach(out => {
        total += out.quantity
      });
    }

    return this.kilosSacksConverterService.kilosToSacks(total, this.batch);
  }

  /**
   * Calcula a quantidade para a lista de saídas
   * @param outs
   */
  calcularTotalQuantidade(outs: Array<StorageUnitOut>) {

    let total = 0;

    if (outs && outs.length > 0) {
      outs.forEach(out => {
        total += out.quantity
      });
    }

    return NumberHelper.toPTBR(total) + ' KG';
  }

	/**
	 * Efetua a pesquisa no componente de busca, pelo lote destino
	 * @param refClient
	 */
  pesquisar(refClient: string) {
    if (this.parent && this.parent.searchComponent) {
      this.parent.searchComponent.form.get('batchCode').setValue(refClient);
      this.parent.searchComponent.search();
    }
  }
}
