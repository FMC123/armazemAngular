import { ErrorHandler } from '../../shared/errors/error-handler';
import { Router } from '@angular/router';
import { BatchOperationService } from '../../batch-operation/batch-operation.service';
import { Notification } from '../../shared/notification';
import { TransportationFiscalNoteService } from '../../transportation/transportation-fiscal-note/transportation-fiscal-note.service';
import { AuthService } from '../../auth/auth.service';
import { BatchOperation } from '../../batch-operation/batch-operation';
import { Transportation } from '../../transportation/transportation';

import { Injectable } from '@angular/core';
import { PersonType } from '../../person/person-type';
import {TransportationService} from "../../transportation/transportation.service";
import {FiscalNote} from "../../fiscal-note/fiscal-note";

@Injectable()
export class BalanceTransportationInService {
	loading = false;

	weighingMode: string;
	transportation: Transportation;
	batchOperation: BatchOperation;

	constructor(
		private auth: AuthService,
		private router: Router,
		private transportationFiscalNoteService: TransportationFiscalNoteService,
		private batchOperationService: BatchOperationService,
    private transportationService: TransportationService,
		private errorHandler: ErrorHandler
	) {}

	refreshFiscalNotes() {
		if (!this.transportation || !this.transportation.id) {
			return Promise.resolve();
		}

		return this.transportationFiscalNoteService
			.list(this.transportation.id)
			.then(fiscalNotes => {
				this.transportation.fiscalNotes = fiscalNotes;
			});
	}

	refreshFiscalNotesAndSelectBatchOperation(batchOperation: BatchOperation) {
		return this.refreshFiscalNotes().then(fiscalNotes => {
			if (batchOperation && batchOperation.id) {
				this.select(this.batchOperations.find(b => b.id === batchOperation.id));
			}
		});
	}

	get fiscalNotesSelected() {
		return this.transportation.fiscalNotes.filter(
			fiscalNote => fiscalNote.selected
		);
	}

	get fiscalNotes() {
		return this.transportation.fiscalNotes;
	}

	get batchOperations() {
		return this.transportation.fiscalNotes
			.map(fiscalNote => {
				return fiscalNote.batchOperation;
			})
			.filter((elem, pos, arr) => {
				return !!elem && arr.findIndex(i => !!i && i.id === elem.id) === pos;
			});
	}

	fiscalNotesOf(batchOperation: BatchOperation) {
		let id = batchOperation.id;
		return this.transportation.fiscalNotes.filter(
			fn => fn.batchOperation && fn.batchOperation.id === id
		);
	}

	get allowManualWeighing() {
		return (
			this.auth.authenticated &&
			(this.auth.accessToken.admin || this.auth.accessToken.leader)
		);
	}

	isOwnerJuridical(batchOperation) {
		if (!batchOperation) {
			return false;
		}

		if (!batchOperation.owner) {
			return false;
		}

		if (!batchOperation.owner.person) {
			return false;
		}

		return batchOperation.owner.person.personType === PersonType.JURIDICAL.code;
	}

	select(batchOperation: BatchOperation) {
		if (this.weighingMode !== 'INDIVIDUAL') {
			this.batchOperation = null;
			return;
		}

		this.batchOperation = batchOperation;
	}

	save(){

		if (!this.batchOperations || !this.batchOperations.length) {
			Notification.error('Não foi criado nenhum lote!');
			return;
		}

		this.loading = true;
		return this.batchOperationService
		.update(this.batchOperations)
		.then(() => {
			this.loading = false;
			Notification.success('Lotes salvos com sucesso!');
			this.router.navigate(['/balance']);
		})
		.catch(error => {
			this.errorHandler.fromServer(error);
			this.loading = false;
		});
	}

  saveFromTransportation(){
    this.loading = true;
    return this.transportationService.updateFromBalance(this.transportation)
      .then(() => {
        this.loading = false;
        Notification.success('Informações de transporte salvos com sucesso!');
        this.router.navigate(['/balance']);
      })
      .catch(error => {
        this.errorHandler.fromServer(error);
        this.loading = false;
      });
  }

	markInAsClose(){
    const promises = [];
	  for(const b of this.batchOperations){
      const p = this.batchOperationService.markInClosed(b);
      promises.push(p);
    }
	  return Promise.all(promises);
  }

	invoiceFieldBlock(): Promise<boolean> {
		return this.transportationFiscalNoteService.invoiceFieldBlock();
	}
	hiddenPurchaseFiled(): Promise<boolean> {
		return this.transportationFiscalNoteService.hiddenPurchaseFiled();
	}

  insertFiscalNoteByBatchOperation(fiscalNote: FiscalNote){
    this.loading = true;
    return this.transportationFiscalNoteService.insertByBatchOperation(fiscalNote)
      .then(() => {
        this.loading = false;
        Notification.success('Nota Fiscal salva com sucesso!');
        this.refreshFiscalNotes();
      })
      .catch(error => {
        this.errorHandler.fromServer(error);
        this.loading = false;
      });
  }
}
