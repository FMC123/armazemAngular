import { TransportationFiscalNoteService } from '../../transportation/transportation-fiscal-note/transportation-fiscal-note.service';
import { FiscalNote } from '../../fiscal-note/fiscal-note';
import { BatchOperation } from '../../batch-operation/batch-operation';
import { Transportation } from '../../transportation/transportation';
import { TransportationService } from '../../transportation/transportation.service';
import { BatchReportService } from '../batch-report.service';
import { Component, OnInit, Input } from '@angular/core';
import { BatchOperationService } from '../../batch-operation/batch-operation.service';
import { BatchOperationCertificateService } from '../../batch-operation/batch-operation-certificate/batch-operation-certificate.service';
import { BatchOperationCertificate } from '../../batch-operation/batch-operation-certificate/batch-operation-certificate';
import { BatchOperationType } from 'app/batch-operation/batch-operation-type';
import { Batch } from 'app/batch/batch';
import { BatchReportComponent } from '../batch-report.component';
import { NumberHelper } from 'app/shared/globalization';
import { StorageUnitLog } from 'app/storage-unit-batch-log/storage-unit-log';
import { StorageUnitBatchLogService } from 'app/storage-unit-batch-log/storage-unit-batch-log.service';
import { StorageUnitBatchLog } from 'app/storage-unit-batch-log/storage-unit-batch-log';
import {KilosSacksConverterService} from "../../shared/kilos-sacks-converter/kilos-sacks-converter.service";
import {StorageUnit} from "../../storage-unit/storage-unit";
import {StorageUnitService} from "../../storage-unit/storage-unit.service";
import {BatchCertificate} from "../../batch-certificate/batch-certificate";
import {BatchCertificateService} from "../../batch-certificate/batch-certificate.service";

@Component({
	selector: 'app-batch-report-in',
	templateUrl: 'batch-report-in.component.html'
})
export class BatchReportInComponent implements OnInit {
	@Input() batch: Batch;
	@Input() parent: BatchReportComponent;

	loading = true;
	batchOperationCertificates: BatchOperationCertificate[];
  batchCertificates: BatchCertificate[];
	batchOperation: BatchOperation;
	transportation: Transportation;
	fiscalNote: FiscalNote;
  fiscalsNote: Array<FiscalNote> = [];
	title: string;
  listagemEntradas: Array<StorageUnitBatchLog>;

	constructor(
		private batchReportService: BatchReportService,
		private batchOperationCertificateService: BatchOperationCertificateService,
		private transportationService: TransportationService,
		private fiscalNoteService: TransportationFiscalNoteService,
		private batchOperationService: BatchOperationService,
    private kilosSacksConverterService: KilosSacksConverterService,
		private storageUnitBatchLogService: StorageUnitBatchLogService,
    private batchCertificateService: BatchCertificateService,
	) { }

	ngOnInit() {
		this.load();
	}

	/**
	 * Efetua a pesquisa no componente de busca
	 * @param refClient
	 */
	pesquisar(refClient: string) {
		if (this.parent && this.parent.searchComponent) {
			this.parent.searchComponent.form.get('batchCode').setValue(refClient);
			this.parent.searchComponent.search();
		}
	}

	get fazenda() {
		return this.fiscalNote && this.fiscalNote.senderStakeholder && this.fiscalNote.senderStakeholder.person
			? this.fiscalNote.senderStakeholder.person.name
			: '-';
	}

	get cooperado() {
		return this.batchOperation &&
			this.batchOperation.owner &&
			this.batchOperation.owner.person
			? this.batchOperation.owner.code +
			' - ' +
			this.batchOperation.owner.person.name
			: '-';
	}

	get purchaseNumber() {
    let result: string = '';
    if (this.fiscalNote && this.fiscalNote.purchaseOrder && this.fiscalNote.purchaseOrder.purchaseOrderCode) {
      result = this.fiscalNote.purchaseOrder.purchaseOrderCode;
    } else {
      result = '-';
    }
    return result;
  }

  get strainer(){
    let result: string = '';
    if (this.batch.strainer && this.batch.strainer.description) {
      result = this.batch.strainer.description;
    } else {
      result = '-';
    }
    return result;
  }

	get notaFiscal() {
	  let fiscalNoteStr:string = '';

    fiscalNoteStr = this.fiscalNote ? this.fiscalNote.code : '-';

    if(fiscalNoteStr == '-')
    {
      let buffer:string[] = [];
      for(let index in this.fiscalsNote){
        let fiscalNote = this.fiscalsNote[index];
        buffer.push(fiscalNote.code);
      }
      if(buffer.length == 0)
      {
        fiscalNoteStr = '-';
      }
      else
      {
        fiscalNoteStr = buffer.join(',')
      }
    }

		return fiscalNoteStr;
	}

	get motorista() {
		return this.transportation ? this.transportation.driverName : '-';
	}

	get placa1() {
		return this.transportation ? this.transportation.vehiclePlate1 : '-';
	}

	get placa2() {
		return this.transportation ? this.transportation.vehiclePlate2 : '-';
	}

  get placa3() {
    return this.transportation ? this.transportation.vehiclePlate3 : '-';
  }

  get contaminants() {
	  let result = '';
	  if (this.batch.contaminants && this.batch.contaminants.length) {
      result = this.batch.contaminants.map(i => {
        let label = i.name;
        if (i.allergenic) {
          label += ' (alerg.)';
        }
	      return label;
      }).join(', ')
    } else {
	    result = '-';
    }
	  return result;
  }

	get certificados() {
		return this.certificatesInfo || '-';
	}

	get certificatesInfo() {
		if (!this.batchOperationCertificates) {
			return '';
		}

		return this.batchOperationCertificates
			.map(boc => boc.certificate.name)
			.join(', ');
	}

	load() {
		this.batchOperationService
			.find(this.batch.batchOperation.id)
			.then(batchOperation => {
				this.batchOperation = batchOperation;
				this.title = new BatchOperationType(this.batchOperation.type).name;
			})
			.then(() => this.storageUnitBatchLogService.batchEntriesList(this.batch.id))
			.then(listaEntradas => {
			  this.listagemEntradas = listaEntradas;
			  this.listagemEntradas.sort((a, b) => {
          let aSlash = a.storageUnitLocation.location.indexOf('/') > -1;
          let bSlash = b.storageUnitLocation.location.indexOf('/') > -1;
          if ((aSlash && bSlash) || (!aSlash && !bSlash)) {
            return a.storageUnitLocation.location.localeCompare(b.storageUnitLocation.location);
          } else {
            return aSlash ? 1 : -1;
          }
        });
			})
			.then(() =>
				this.batchOperationCertificateService.list(this.batchOperation.id, true)
			)
			.then(batchOperationCertificates => {
			  this.batchOperationCertificates = batchOperationCertificates
        if(this.batchOperationCertificates == undefined || this.batchOperationCertificates == null || this.batchOperationCertificates.length == 0)
        {
          this.batchCertificateService.list(this.batch.id, true).then(
            batchCertificates => (this.batchCertificates = batchCertificates)
          );
        }
			})
			.then(() => {
				return this.transportationService.findByBatchOperation(
					this.batchOperation.id
				);
			})
			.then(transportation => {
				this.transportation = transportation;
			})
			.then(() => this.fiscalNoteService.list(this.transportation.id))
			.then(fiscalNotes => {
				return fiscalNotes.find(
					fn =>
						fn.batchOperation && fn.batchOperation.id === this.batchOperation.id
				);
			})
			.then(fiscalNote => (this.fiscalNote = fiscalNote))
			.then(() => (this.loading = false))
			.catch(() => {
				// ignora pois não possui transporte
				this.transportation = null;
				this.fiscalNote = null;
				this.fiscalsNote = [];

				//Tenta buscar por batchoperation, pois pode trata-se de uma transferencia de titularidade
        if(this.batchOperation.type == BatchOperationType.OT_IN.code)
        {
          this.fiscalNoteService.listFiscalNoteByBatchOperation(this.batchOperation.id).then(fiscalNotes => {
            this.fiscalsNote = fiscalNotes;
          });
        }

				this.loading = false;
			});
	}

	/**
	 * Calcula a quantidade para a lista de saídas
	 * @param outs
	 */
	calcularTotalQuantidade(outs: Array<StorageUnitBatchLog>) {

		let total = 0;

		if (outs && outs.length > 0) {
			outs.forEach(out => {
				total += out.quantity
			});
		}

		return total;
	}

  calcularTotalQuantidadeString(outs: Array<StorageUnitBatchLog>) {
	  return NumberHelper.toPTBR(this.calcularTotalQuantidade(outs)) + ' KG';
  }

  calcularTotalSacks(outs: Array<StorageUnitBatchLog>) {
    return this.kilosSacksConverterService.kilosToSacks(this.calcularTotalQuantidade(outs), this.batch);
  }
}
