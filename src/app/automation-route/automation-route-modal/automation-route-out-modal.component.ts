import { MarkupGroupService } from '../../markup-group/markup-group.service';
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
import { BalanceService } from '../../balance/balance.service';
import { Batch } from '../../batch/batch';
import { BatchService } from '../../batch/batch.service';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { StorageUnitService } from '../../storage-unit/storage-unit.service';
import { AutomationRouteItem } from '../automation-route-item';
import { AutomationTypeModal } from './../automation-route-modal-type';
import { AutomationRouteService } from './../automation-route.service';
import { AutomationStatus } from './../automation-status';
import { TagSendData } from './../tag-send-data';
import { TypeRouteEquipment } from './../type-route-equipment';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-automation-route-out-modal',
	templateUrl: './automation-route-out-modal.component.html'
})
export class AutomationRouteOutModalComponent implements OnInit, OnDestroy {
	@Output() close: EventEmitter<void> = new EventEmitter<void>(false);
	@Input() batchOperation: BatchOperation;

	private subscription: Subscription;

	loading: boolean = false;

	portoes: Array<Position> = [];
	moegas: Array<Position> = [];
	silos: Array<Position> = [];

	listAutomationRoutesItem: Array<AutomationRouteItem> = new Array<
		AutomationRouteItem
	>();
	statuses = AutomationStatus.list();
	action: boolean = false;
	closeDumpingConfirm = false;
	suspendAutomationConfirm = false;

	dumpingPositionId = '';
	dumpingAutomationRouteId = '';

	initDumpingAutomation = false;
	finalizeDumpingAutomation = false;

	itemSelected: AutomationRouteItem;
	batches: Array<Batch> = new Array<Batch>();

	constructor(
		private auth: AuthService,
		private automationService: AutomationRouteService,
		private errorHandler: ErrorHandler,
		private balanceService: BalanceService,
		private batchService: BatchService,
		private storageUnitService: StorageUnitService,
		private positionService: PositionService,
		private markupGroupService: MarkupGroupService
	) {}

	ngOnInit() {
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
				PositionType.PORTAO
			),
			this.positionService.listByWarehouseAndType(
				this.auth.accessToken.warehouse.id,
				PositionType.SILO
			),
			this.markupGroupService.find(this.batchOperation.markupGroup.id)
		])
			.then(responses => {
				this.listAutomationRoutesItem = <any>responses[0];
				this.moegas = <any>responses[1];
				this.portoes = <any>responses[2];
				this.silos = <any>responses[3];
				this.batchOperation.markupGroup = <any>responses[4];
				this.loading = false;
			})
			.catch(error => this.handleError(error));
	}

	handleError(error) {
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}

	get optionsForDumping() {
		return [...this.moegas, ...this.portoes, ...this.silos];
	}

	get availableRoutesForDumping() {
		return [
			...this.availableRoutesFor(
				TypeRouteEquipment.MOEGA_GRANEL,
				this.dumpingPositionId
			),
			...this.availableRoutesFor(
				TypeRouteEquipment.SILO_GRANEL,
				this.dumpingPositionId
			),
      ...this.availableRoutesFor(
        TypeRouteEquipment.MOEGA_SILO,
        this.dumpingPositionId
      )
		];
	}

	availableRoutesFor(type: TypeRouteEquipment, positionId: string) {
		let availableOptions = this.listAutomationRoutesItem.filter(
			a => a.typeRouteEquipment.code === type.code
		);

		let matchSelectedPosition = a => a.positionOrigin.id === positionId;
		availableOptions = availableOptions.filter(matchSelectedPosition);

		let uniqueByPositionDestination = (a, index) =>
			index ===
			availableOptions.findIndex(
				b => a.positionDestination.name === b.positionDestination.name
			);
		availableOptions = availableOptions.filter(uniqueByPositionDestination);

		let sortByPositionOriginName = (a, b) =>
			a.positionOrigin.name.localeCompare(b.positionOrigin.name);
		return availableOptions.sort(sortByPositionOriginName);
	}

	get currentPositionBatch() {
		if (!this.batchOperation) {
			return null;
		}

		if (!this.batchOperation.markupGroup) {
			return null;
		}

		if (
			!this.batchOperation.markupGroup.batches ||
			!this.batchOperation.markupGroup.batches.length
		) {
			return null;
		}

		const positionCodes = this.batchOperation.markupGroup.batches
			.filter(b => b.position && !!b.position.nameCode)
			.map(b => b.position.nameCode);

		if (!positionCodes || !positionCodes.length) {
			return null;
		}

		return positionCodes[0];
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

	finallyAutomation() {
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
	}

	initAutomationDumping() {
		this.initiAutomation();
		this.updateStatus(this.itemSelected);
		this.dumpingMoveTo();
	}

	finallyAutomationDumping() {
		this.finallyAutomation();
		this.updateStatus(this.itemSelected);
		this.dumpingFinishing();
	}

	get allowAutomationRouteDumping() {
		if (
			!this.dumpingAutomationRouteId &&
			this.dumpingAutomationRouteId === ''
		) {
			return false;
		}

		if (this.availableRoutesForDumping) {
			return this.availableRoutesForDumping.length > 0;
		}

		return false;
	}

	get disableButtonDumping() {
		let uniqueByAutomationRouteItem = r =>
			r.id === this.dumpingAutomationRouteId;

		let automationAvaible = this.listAutomationRoutesItem.filter(
			uniqueByAutomationRouteItem
		);

		this.itemSelected = automationAvaible[0];

		if (
			automationAvaible[0] &&
			automationAvaible[0].automationStatusName.code !== 'FREE'
		) {
			return true;
		}

		if (
			(this.itemSelected && this.itemSelected.batchCodeDestination) ||
			this.itemSelected.batchCodeOrigin
		) {
			return true;
		}

		return false;
	}

	get allowDumpingMoveBatch() {
		if (this.loading) {
			return false;
		}

		if (!this.dumpingPositionId) {
			return false;
		}

		if (
			this.availableRoutesForDumping &&
			this.availableRoutesForDumping.length
		) {
			return false;
		}

		return true;
	}

	dumpingMoveTo() {
		this.loading = true;
		this.markupGroupService
			.moveAllMarkGroupBatch(this.batchOperation, this.dumpingPositionId)
			.then(response => {
				this.loading = false;
				Notification.success('Romaneio movido com sucesso!');
			})
			.catch(error => this.handleError(error));
	}
	dumpingFinishing() {
		this.loading = true;
		this.markupGroupService
			.finishAllMarkGroupMatch(this.batchOperation)
			.then(response => {
				this.loading = false;
				Notification.success('Romaneio finalizado com sucesso!');
			})
			.catch(error => this.handleError(error));
	}

	closeDumpingConfirmHandler(confirm) {
		this.closeDumpingConfirm = false;
		if (confirm) {
			this.dumpingFinishing();
		}
	}

	get allowCloseDumping() {
		if (this.closeDumpingConfirm) {
			return false;
		}

		if (this.action) {
			return false;
		}

		return true;
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
					case 'MOEGA_EMBEGADORA':
						item.status = 'BAGGING';
						break;
					case 'MOEGA_GRANEL':
						item.status = 'DUMPING';
						break;
					case 'SILO_GRANEL':
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

	initDumpingAutomationHandler(confirm) {
		this.initDumpingAutomation = false;
		if (confirm) {
			this.initAutomationDumping();
		}
	}

	finalizeDumpingAutomationHandler(confirm) {
		this.finalizeDumpingAutomation = false;
		if (confirm) {
			this.finallyAutomationDumping();
		}
	}
}
