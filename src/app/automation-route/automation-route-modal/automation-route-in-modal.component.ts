import { BatchOperation } from '../../batch-operation/batch-operation';
import {
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output
} from '@angular/core';
import { Notification } from 'app/shared/notification/notification';
import { Observable, Subscription } from 'rxjs/Rx';

import { AuthService } from '../../auth/auth.service';
import { Position } from '../../position/position';
import { PositionType } from '../../position/position-type';
import { PositionService } from '../../position/position.service';
import { BalanceService } from './../../balance/balance.service';
import { Batch } from './../../batch/batch';
import { BatchService } from './../../batch/batch.service';
import { ErrorHandler } from './../../shared/errors/error-handler';
import { StorageUnitService } from './../../storage-unit/storage-unit.service';
import { AutomationRouteItem } from './../automation-route-item';
import { AutomationTypeModal } from './../automation-route-modal-type';
import { AutomationRouteService } from './../automation-route.service';
import { AutomationStatus } from './../automation-status';
import { TagSendData } from './../tag-send-data';
import { TypeRouteEquipment } from './../type-route-equipment';
import { AutomationRouteDuctClean } from 'app/automation-route/automation-route-duct-clean';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-automation-route-in-modal',
	templateUrl: './automation-route-in-modal.component.html'
})
export class AutomationRouteInModalComponent implements OnInit, OnDestroy {
	@Output() close: EventEmitter<void> = new EventEmitter<void>(false);
	@Input() batch: Batch;
	@Input() batchOperation: BatchOperation;
	@Input() automationType: AutomationTypeModal;

	private subscription: Subscription;

	loading: boolean = false;

	portoes: Array<Position> = [];
	moegas: Array<Position> = [];
	silos: Array<Position> = [];
	embegadoras: Array<Position> = [];

	listAutomationRoutesItem: Array<AutomationRouteItem> = new Array<
		AutomationRouteItem
		>();
	statuses = AutomationStatus.list();

	closeReceivingConfirm = false;
	initReceivingAutomation = false;
	finalizeReceivingAutomation = false;
	initBaggingAutomation = false;
	finalizeBaggingAutomation = false;
	suspendBaggingAutomation = false;
	linkBatch = false;
	unLinkBatch = false;

	recevingPositionId = '';
	recevingAutomationRouteId = '';
	baggingAutomationRouteId = '';
	baggingPositionId = '';

	buttonLabelInit = '';
	buttonLabelFinally = '';
	itemSelected: AutomationRouteItem;

	constructor(
		private auth: AuthService,
		private automationService: AutomationRouteService,
		private errorHandler: ErrorHandler,
		private balanceService: BalanceService,
		private batchService: BatchService,
		private storageUnitService: StorageUnitService,
		private positionService: PositionService
	) { }

	ngOnInit() {
		this.recevingPositionId = '';
		this.baggingPositionId = '';

		this.list();

		this.subscription = Observable.timer(10000, 10000).subscribe(() => {
			this.list(true);
		});
	}

	ngOnDestroy() {
		if (this.subscription && !this.subscription.closed) {
			this.subscription.unsubscribe();
		}
	}

	list(skipLoading?: boolean) {
		if (!skipLoading) {
			this.loading = true;
		}

		return Promise.all([
			this.automationService.list(),
			this.positionService.listByWarehouseAndType(
				this.auth.accessToken.warehouse.id,
				PositionType.MOEGA
			),
			this.positionService.listByWarehouseAndType(
				this.auth.accessToken.warehouse.id,
				PositionType.SILO
			),
			this.positionService.listByWarehouseAndType(
				this.auth.accessToken.warehouse.id,
				PositionType.PORTAO
			),
			this.positionService.listByWarehouseAndType(
				this.auth.accessToken.warehouse.id,
				PositionType.EMBEGADORA
			),
			this.batchService.find(this.batch.batchOperation.id, this.batch.id)
		])
			.then(responses => {
				this.listAutomationRoutesItem = <any>responses[0];
				this.moegas = <any>responses[1];
				this.silos = <any>responses[2];
				this.portoes = <any>responses[3];
				this.embegadoras = <any>responses[4];
				this.batch = <any>responses[5];
				this.loading = false;
			})
			.catch(error => this.handleError(error));
	}

	handleError(error) {
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}

	get optionsForReceiving() {
		return [...this.moegas, ...this.embegadoras];
	}

	get optionsForBagging() {
		return [...this.silos, ...this.moegas];
	}

	get availableRoutesForReceiving() {
		if (!this.recevingPositionId) {
			return [];
		}

		return [
			...this.availableRoutesFor(
				TypeRouteEquipment.MOEGA_SILO,
				this.recevingPositionId
			)
		];
	}

	get availableRoutesForBagging() {
		return [
			...this.availableRoutesFor(
				TypeRouteEquipment.SILO_EMBEGADORA,
				this.baggingPositionId
			),
			...this.availableRoutesFor(
				TypeRouteEquipment.MOEGA_EMBEGADORA,
				this.baggingPositionId
			)
		];
	}

  availableRoutesFor(type: TypeRouteEquipment, positionId: string) {

    //filtra pelo tipo
    let matchType = a => a.typeRouteEquipment.code === type.code;
    let availableOptions = this.listAutomationRoutesItem.filter(matchType);

    //filtra pelo id da origem
    let matchSelectedPosition = a => a.positionOrigin.id === positionId;
    availableOptions = availableOptions.filter(matchSelectedPosition);

    //lista o id da origem DISTINCT
    let uniqueByPositionDestination = (a, index) =>
      index ===
      availableOptions.findIndex(
        b => a.positionDestination.name === b.positionDestination.name
      );
    availableOptions = availableOptions.filter(uniqueByPositionDestination);

		let sortByPositionDestinationName = (a, b) =>
			a.positionDestination.name.localeCompare(b.positionDestination.name);
		availableOptions.sort(sortByPositionDestinationName);

		return availableOptions;
	}

	get currentPositionBatch() {
		let positionString = '';

		let availableOptions = this.listAutomationRoutesItem;

		let equalBatchCode = a => a.batchCodeDestination === this.batch.batchCode;

		availableOptions = this.listAutomationRoutesItem.filter(equalBatchCode);

		let uniqueByPositionDestination = (a, index) =>
			index ===
			availableOptions.findIndex(
				b => a.positionDestination.name === b.positionDestination.name
			);

		let sortByPositionDestinationName = (a, b) =>
			a.positionDestination.name.localeCompare(b.positionDestination.name);

		availableOptions = availableOptions.filter(uniqueByPositionDestination);

		availableOptions.sort(sortByPositionDestinationName);

		availableOptions.forEach(a => {
			positionString += a.positionDestination.nameCode + ' ';
		});
		return positionString ? positionString : this.batch.positionName;
	}

	receivingMoveTo() {
		this.loading = true;
		this.balanceService
			.batchOperationMoveUrl(
				this.batch.batchOperation,
				this.batch.id,
				this.recevingPositionId
			)
			.then(() => {
				this.recevingPositionId = '';
				return this.list();
			})
			.then(() => {
				Notification.success('Lote movido com sucesso!');
				this.loading = false;
			})
			.catch(error => this.handleError(error));
	}

	baggingMoveTo() {
		this.loading = true;
		this.balanceService
			.batchOperationMoveUrl(
				this.batch.batchOperation,
				this.batch.id,
				this.baggingPositionId
			)
			.then(() => {
				this.baggingPositionId = '';
				return this.list();
			})
			.then(() => {
				Notification.success('Lote movido com sucesso!');
				this.loading = false;
			})
			.catch(error => this.handleError(error));
	}

	get allowReceivingMoveBatch() {
		if (this.loading) {
			return false;
		}
		if (!this.recevingPositionId && this.recevingPositionId === '') {
			return false;
		}
		if (
			this.availableRoutesForReceiving &&
			this.availableRoutesForReceiving.length
		) {
			return false;
		}
		return true;
	}

	get allowBaggingMoveBatch() {
		if (this.loading) {
			return false;
		}
		if (!this.baggingPositionId && this.baggingPositionId === '') {
			return false;
		}
		if (
			this.availableRoutesForBagging &&
			this.availableRoutesForBagging.length
		) {
			return false;
		}
		return true;
	}

	get allowCloseReceiving() {
		if (this.closeReceivingConfirm) {
			return false;
		}
		if (this.automationType.code !== AutomationTypeModal.RECEIVING.code) {
			return false;
		}
		return !!this.batch.positionId;
	}

	get disableSuspendAutomation() {
		if (
			!this.baggingAutomationRouteId ||
			this.baggingAutomationRouteId === ''
		) {
			return true;
		}
		if (!this.itemSelected) {
			return true;
		}

		if (this.automationType.code !== 'BAGGING') {
			return true;
		}

		return false;
	}

	get disableLinkBatchBagging() {
		if (!this.baggingAutomationRouteId) {
			return true;
		}
		return false;
	}

	get disableLinkBatch() {
		if (!this.recevingAutomationRouteId) {
			return true;
		}
		return false;
	}
	get allowUnlinkBatch() {
		if (!this.batch.positionName) {
			return false;
		}
		return true;
	}

	unlinkBatch() {
		this.automationService.unlinkBatch(this.itemSelected, this.batch);
		Notification.success('Removido vinculo com sucesso!');
	}

	suspendAutomation() {
		this.finallyAutomation();
	}

	closeReceiving() {
		this.loading = true;

		this.batchService
			.batchReceiveFinish(this.batch)
			.then(() => {
				this.loading = false;
				Notification.success('Recebimento finalizado com sucesso!');
				(<any>jQuery)('.modal').modal('hide');
			})
			.catch(error => this.handleError(error));
	}

	get allowAutomationRouteReceving() {
		if (
			!this.recevingAutomationRouteId &&
			this.recevingAutomationRouteId === ''
		) {
			return false;
		}

		if (this.availableRoutesForReceiving) {
			return this.availableRoutesForReceiving.length > 0;
		}

		return false;
	}

	get allowAutomationRouteBagging() {
		if (
			!this.baggingAutomationRouteId &&
			this.baggingAutomationRouteId === ''
		) {
			return false;
		}

		if (this.availableRoutesForBagging) {
			return this.availableRoutesForBagging.length > 0;
		}

		return false;
	}

	get disableButtonReceiving() {
		let uniqueByAutomationRouteItem = r =>
			r.id === this.recevingAutomationRouteId;
		let automationAvaible = this.listAutomationRoutesItem.filter(
			uniqueByAutomationRouteItem
		);
		this.itemSelected = automationAvaible[0];

		if (
			(this.itemSelected && this.itemSelected.batchCodeDestination) ||
			this.itemSelected.batchCodeOrigin
		) {
			return true;
		}

		return false;
	}

  get disableButtonBagging() {
    if (
      !this.baggingAutomationRouteId ||
      this.baggingAutomationRouteId === ''
    ) {
      return true;
    }

		let uniqueByAutomationRouteItem = r =>
			r.id === this.baggingAutomationRouteId;

		let automationAvaible = this.listAutomationRoutesItem.filter(
			uniqueByAutomationRouteItem
		);

		this.itemSelected = automationAvaible[0];

    if (this.itemSelected &&
      this.itemSelected.batchCodeDestination &&
      this.itemSelected.batchCodeDestination !== this.batch.batchCode
      //     this.itemSelected &&
      //     this.itemSelected.batchCodeOrigin &&
      //     this.itemSelected.batchCodeOrigin !== this.batch.batchCode
    ) {
      return true;
    }

		return false;
	}

	get disableButtonFinalizeBagging() {
		if (
			!this.baggingAutomationRouteId ||
			this.baggingAutomationRouteId === ''
		) {
			return true;
		}

		let uniqueByAutomationRouteItem = r =>
			r.id === this.baggingAutomationRouteId;
		let automationAvaible = this.listAutomationRoutesItem.filter(
			uniqueByAutomationRouteItem
		);
		this.itemSelected = automationAvaible[0];

		if (this.itemSelected.batchCodeOrigin !== this.batch.batchCode) {
			return true;
		}

		let availableOptions = this.listAutomationRoutesItem;
		let equalBatchCode = a => a.batchCodeOrigin === this.batch.batchCode;
		availableOptions = this.listAutomationRoutesItem.filter(equalBatchCode);
		let uniqueByPositionDestination = (a, index) =>
			index ===
			availableOptions.findIndex(
				b => a.positionDestination.name === b.positionDestination.name
			);

		availableOptions = availableOptions.filter(uniqueByPositionDestination);

		if (
			availableOptions.filter(a => a.positionDestination.type === 'E').length >
			0
		) {
			return false;
		}

		return true;
	}

	initiAutomation() {
		if (!this.itemSelected) {
			return;
		}
		this.loading = true;
		if (
			!this.itemSelected.tagOperation1 ||
			!this.itemSelected.tagOperation1.id
		) {
			throw new Error('Tag 1 não informada!');
		}

		this.automationService
			.executeCommand(this.itemSelected.tagOperation1.id)
			.then(() => {
				if (this.itemSelected.tagOperation2) {
					return delay(environment.INTERVAL_AUTOMATION_EXECUTE_TAG).then(() =>
						this.automationService.executeCommand(
							this.itemSelected.tagOperation2.id
						)
					);
				}
			})
			.then(() => {
				this.loading = false;
				Notification.success('Comando enviado com sucesso!');
			})
			.catch(() => {
				Notification.error('Erro ao enviar comando para automação!');
			});
	}

	finallyAutomation(): boolean {
		if (!this.itemSelected) {
			return;
		}

		this.loading = true;

		if (
			!this.itemSelected.tagFinalization1 ||
			!this.itemSelected.tagFinalization1.id
		) {
			throw new Error('Tag 1 não informada!');
		}

		this.automationService
			.executeCommand(this.itemSelected.tagFinalization1.id)
			.then(() => {
				if (this.itemSelected.tagFinalization2) {
					return this.automationService.executeCommand(
						this.itemSelected.tagFinalization2.id
					);
				}
			})
			.then(() => {
				this.loading = false;
				Notification.success('Comando enviado com sucesso!');
			})
			.catch(() => {
				Notification.error('Erro ao enviar comando para automação!');
			});

		this.regiterDuctClean();
	}

	initAutomationBagging() {
		this.moveToEmbegadora().then(() => {
			return this.initiAutomation();
		})
	}

	/*finallyAutomationBagging() {
		this.finallyAutomation();
		this.finallyMoveRemovingTwoPositions();
	}*/

	initAutomationReceiving() {
		return this.onlyMovePosition().then(() => {
			return this.initiAutomation();
		});
	}

	finallyAutomationReceiving() {
		this.finallyAutomation();

		if (this.isDestinationEmbegadora()) {
			this.finallyMoveRemovingTwoPositions();
			return;
		}

		this.finallyMoveRemovingOnePosition();
	}

	onlyMovePosition() {
		return this.balanceService
			.batchOperationMoveUrlOnlyMove(
				this.batch.batchOperation,
				this.batch.id,
				this.itemSelected.positionDestination.id
			)
			.then(() => {
				return this.balanceService.batchOperationMoveUrlOnlyMove(
					this.batch.batchOperation,
					this.batch.id,
					this.itemSelected.positionOrigin.id
				);
			})
			.then(() => {
				return this.updateStatus(this.itemSelected);
			})
			.catch(error => {
				this.handleError(error);
				return Promise.reject(error);
			});
	}

	movePosition() {
		return this.balanceService
			.batchOperationMoveUrlOnlyMove(
				this.batch.batchOperation,
				this.batch.id,
				this.itemSelected.positionDestination.id
			)
			.then(() => {
				Notification.success('Lote movido com sucesso!');
			})
			.catch(error => {
				this.handleError(error);
				return Promise.reject(error);
			});
	}

	moveToEmbegadora() {
		return this.balanceService
			.batchOperationMoveUrlOnlyMove(
				this.batch.batchOperation,
				this.batch.id,
				this.itemSelected.positionOrigin.id
			)
			.then(() => {
				return this.balanceService.batchOperationMoveUrlOnlyMove(
					this.batch.batchOperation,
					this.batch.id,
					this.itemSelected.positionDestination.id
				);
			})
			.then(() => this.updateStatus(this.itemSelected))
			.catch(error => {
				this.handleError(error);
				return Promise.reject(error);
			});
	}

	finallyMoveRemovingTwoPositions() {
		this.balanceService.batchOperationFinallyMove(
			this.batch.batchOperation,
			this.batch.id,
			this.itemSelected.positionOrigin.id,
			this.itemSelected.positionDestination
		);
		this.updateStatus(this.itemSelected);
	}

	finallyMoveRemovingOnePosition() {
		this.balanceService.batchOperationFinallyMove(
			this.batch.batchOperation,
			this.batch.id,
			this.itemSelected.positionOrigin.id,
			null
		);

		this.updateStatus(this.itemSelected);
	}

	cleanPosition() {
		this.batchService.batchReceiveFinish(this.batch);
	}
	updateStatus(item: AutomationRouteItem) {
		if (item.status !== 'INACTIVE') {
			item.status = 'FINALIZING';
		} else {
			if (item.typeRouteEquipment) {
				switch (item.typeRouteEquipment.code) {
					case 'SILO_SILO':
						item.status = 'TRANSFERRING';
						break;
					case 'SILO_EMBEGADORA':
						item.status = 'BAGGING';
						break;
					case 'MOEGA_GRANEL':
						item.status = 'DUMPING';
						break;
					case 'MOEGA_SILO':
						item.status = 'RECEIVING';
						break;
					default:
						break;
				}
			}
		}
		this.automationService.updateStatus(item);
	}

	closeReceivingConfirmHandler(confirm) {
		this.closeReceivingConfirm = false;

		if (confirm) {
			this.closeReceiving();
		}
	}

	initReceivingAutomationHandler(confirm) {
		this.initReceivingAutomation = false;
		if (confirm) {
			this.initAutomationReceiving();
		}
	}

	finalizeReceivindAutomationHandler(confirm) {
		this.finalizeReceivingAutomation = false;
		if (confirm) {
			this.finallyAutomationReceiving();
		}
	}

	initBaggingAutomationHandler(confirm) {
		this.initBaggingAutomation = false;
		if (confirm) {
			this.initAutomationBagging();
		}
	}

	suspendBaggingAutomationHandler(confirm) {
		this.suspendBaggingAutomation = false;
		if (confirm) {
			this.detachPositionOrigin();
			this.finallyAutomation();
		}
	}

	detachPositionOrigin() {
		if (!this.itemSelected) {
			return;
		}

		if (!this.itemSelected.positionOrigin) {
			return;
		}

		if (!this.itemSelected.batchOrigin) {
			return;
		}

		return this.automationService.detachBatchPosition(this.itemSelected.batchOrigin.id, this.itemSelected.positionOrigin.id);
	}

	finalizeBaggingAutomationHandler(confirm) {
		this.finalizeBaggingAutomation = false;
		if (confirm) {
			this.finallyMoveRemovingTwoPositions();
			//this.finallyAutomationBagging();
		}
	}

	linkBatchHandler(confirm) {
		this.linkBatch = false;
		if (confirm) {
			this.movePosition();
		}
	}

	unLinkBatchHandler(confirm) {
		this.unLinkBatch = false;
		if (confirm) {
			this.unlinkBatch();
		}
	}

	regiterDuctClean() {
		let ductClean = new AutomationRouteDuctClean();
		ductClean.automationRouteItem = this.itemSelected;
		ductClean.batchCode = this.batch.batchCode;
		ductClean.batchOperationCode = this.batchOperation
			? this.batchOperation.batchOperationCode
			: '';
		ductClean.routeItemStatusCode = this.itemSelected.getRouteItemStatus.code;
		this.automationService.registerDuctClean(ductClean);
	}

	isDestinationEmbegadora() {
		if (!this.itemSelected) {
			return false;
		}

		if (!this.itemSelected.positionDestination) {
			return false;
		}

		return (
			this.itemSelected.positionDestination.type ===
			PositionType.EMBEGADORA.code
		);
	}

	positionToShow(position: Position) {
		if (position.automationBatch) {
			return position.name + " - " + position.automationBatch.batchCode;
		}
		return position.name;
	}

  automationRouteToShow(route: AutomationRouteItem) {
    if (route.batchDestination && route.batchDestination.batchCode) {
      return route.positionDestination.name + " - " + route.batchDestination.batchCode;
    }

    return route.positionDestination.name;
  }
}
