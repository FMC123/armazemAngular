import { TransportationService } from '../../../transportation/transportation.service';
import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

import { BatchOperation } from '../../../batch-operation/batch-operation';
import { BatchOperationWeight } from '../../../batch-operation/batch-operation-weight';
import { BatchOperationService } from '../../../batch-operation/batch-operation.service';
import { ErrorHandler } from '../../../shared/errors/error-handler';
import { Masks } from '../../../shared/forms/masks/masks';
import { ModalManager } from '../../../shared/modals/modal-manager';
import { Transportation } from '../../../transportation/transportation';
import { BalanceService } from '../../balance.service';
import { BalanceTransportationOutService } from '../balance-transportation-out.service';
import { AutomationSemaphoreService } from '../../../automation-semaphore/automation-semaphore.service';

@Component({
	selector: 'app-balance-transportation-out-batch-operation-list',
	templateUrl: 'balance-transportation-out-batch-operation-list.component.html'
})
export class BalanceTransportationOutBatchOperationListComponent
	implements OnInit {
	@Input() transportation: Transportation;
	deleteConfirm = new ModalManager();
	loading = false;
	downloadLoading = false;
	decimalMask = Masks.decimalMask;
	shippingAuthorizationModal = new ModalManager();
	automationRouteModal = new ModalManager();
	private editGross;
	private editTare;

	constructor(
		private balanceTransportationOutService: BalanceTransportationOutService,
		private batchOperationService: BatchOperationService,
		private balanceService: BalanceService,
		private errorHandler: ErrorHandler,
		private transportationService: TransportationService,
		private router: Router
	) {}

	ngOnInit() {}

	get batchOperationOut() {
		return this.balanceTransportationOutService.batchOperationOut;
	}

  get sacksQuantityCalc() {
	  if(this.batchOperationOut && this.batchOperationOut.markupGroup && this.batchOperationOut.markupGroup.batches) {
      const batches = this.batchOperationOut.markupGroup.batches;
      if (batches.length > 0) {
          let total = batches.map(batch=>batch.weightSack || 0).reduce((a,b)=> a+b,0);
          return total || 0;
      }
    }
	  return 0;
  }

	handleError(error) {
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}

	onDeleteClick(event: Event, id: string) {
		event.stopPropagation();
		this.deleteConfirm.open(id);
	}

	get allowManualWeighing() {
		return this.balanceTransportationOutService.allowManualWeighing;
	}

	setEditGross(batchOperation: BatchOperation) {
		this.editGross = batchOperation.id;
	}

	setEditTare(batchOperation: BatchOperation) {
		this.editTare = batchOperation.id;
	}

	unsetEditGross() {
		this.editGross = null;
	}

	unsetEditTare() {
		this.editTare = null;
	}

	weighGross(batchOperation: BatchOperation) {
		let batchOperationWeight = new BatchOperationWeight();
		batchOperationWeight.scale = this.balanceService.scale;
		batchOperationWeight.listBatchOperations = [batchOperation];
		batchOperationWeight.type = 'GROSS';

		this.balanceService
			.saveWeight(batchOperationWeight)
			.then(response => {
				batchOperation.grossWeight = response.weight;
			})
			.then(() => {
				return this.transportationService.find(
					this.balanceTransportationOutService.transportation.id
				);
			})
			.then(transportation => {
				this.balanceTransportationOutService.transportation = transportation;
			})
			.catch(error => this.errorHandler.fromServer(error));
	}

	saveGross(batchOperation: BatchOperation) {
		let batchOperationWeight = new BatchOperationWeight();
		batchOperationWeight.listBatchOperations = [batchOperation];
		batchOperationWeight.weight = batchOperation.grossWeight;
		batchOperationWeight.type = 'GROSS';
		batchOperationWeight.manual = true;

		this.balanceService
			.saveWeight(batchOperationWeight)
			.then(response => {
				this.editGross = false;
				batchOperation.grossWeight = response.weight;
			})
			.then(() => {
				return this.transportationService.find(
					this.balanceTransportationOutService.transportation.id
				);
			})
			.then(transportation => {
				this.balanceTransportationOutService.transportation = transportation;
			})
			.catch(error => this.errorHandler.fromServer(error));
	}

	weighTare(batchOperation: BatchOperation) {
		let batchOperationWeight = new BatchOperationWeight();
		batchOperationWeight.scale = this.balanceService.scale;
		batchOperationWeight.listBatchOperations = [batchOperation];
		batchOperationWeight.type = 'TARE';

		this.balanceService
			.saveWeight(batchOperationWeight)
			.then(response => {
				this.editTare = false;
				batchOperation.tara = response.weight;
			})
			.then(() => {
				return this.transportationService.find(
					this.balanceTransportationOutService.transportation.id
				);
			})
			.then(transportation => {
				this.balanceTransportationOutService.transportation = transportation;
			})
			.catch(error => this.errorHandler.fromServer(error));
	}

	saveTare(batchOperation: BatchOperation) {
		let batchOperationWeight = new BatchOperationWeight();
		batchOperationWeight.listBatchOperations = [batchOperation];
		batchOperationWeight.weight = batchOperation.tara;
		batchOperationWeight.type = 'TARE';
		batchOperationWeight.manual = true;

		this.balanceService
			.saveWeight(batchOperationWeight)
			.then(response => {
				this.editTare = false;
				batchOperation.tara = response.weight;
			})
			.then(() => {
				return this.transportationService.find(
					this.balanceTransportationOutService.transportation.id
				);
			})
			.then(transportation => {
				this.balanceTransportationOutService.transportation = transportation;
			})
			.catch(error => this.errorHandler.fromServer(error));
	}

	associateWithShippingAuthorization(transportation) {
		if (this.transportation.shippingAuthorization) {
			this.router.navigate(
				[
					'/shipping-authorization',
					this.transportation.shippingAuthorization.id,
					'transportation',
					this.transportation.id
				],
				{ queryParams: { origin: 'balance' } }
			);
		} else {
			this.shippingAuthorizationModal.open(transportation);
		}
	}

	allowWeightGross(batchOperation: BatchOperation) {
		return !!batchOperation.tara;
	}

	automationRouteModalCloseHandler() {
		this.automationRouteModal.close();
		//  this.loadList();
	}
}
