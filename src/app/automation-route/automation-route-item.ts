import { AutomationStatus } from './automation-status';
import { TypeRouteEquipment } from './type-route-equipment';
import { Position } from './../position/position';
import { RouteItemStatus } from './route-item-status';
import { EquipamentTag } from './../equipament/equipament-tag/equipament-tag';
import { Warehouse } from './../warehouse/warehouse';
import { DateTimeHelper } from '../shared/globalization';
import { NumberHelper } from '../shared/globalization';
import { User } from '../user/user';
import { Scale } from '../scale/scale';
import { Batch } from '../batch/batch';

export class AutomationRouteItem {
	static fromListData(
		listData: Array<AutomationRouteItem>
	): Array<AutomationRouteItem> {
		return listData.map(data => {
			return AutomationRouteItem.fromData(data);
		});
	}

	static fromData(data: AutomationRouteItem): AutomationRouteItem {
		if (!data) return new this();
		let automation = new this(
			data.id,
			data.wareHouse,
			data.positionOrigin,
			data.positionDestination,
			data.tagOperation1,
			data.tagOperation2,
			data.tagFinalization1,
			data.tagFinalization2,
			data.status,
			data.batchCodeOrigin,
			data.batchCodeDestination,
			data.batchOrigin,
			data.batchDestination
		);
		return automation;
	}
	typeRouteEquipment: TypeRouteEquipment;
	automationStatus: AutomationStatus;
	buttonLabel: string;

	constructor(
		public id?: string,
		public wareHouse?: Warehouse,
		public positionOrigin?: Position,
		public positionDestination?: Position,
		public tagOperation1?: EquipamentTag,
		public tagOperation2?: EquipamentTag,
		public tagFinalization1?: EquipamentTag,
		public tagFinalization2?: EquipamentTag,
		public status?: string,
		public batchCodeOrigin?: string,
		public batchCodeDestination?: string,
		public batchOrigin?: Batch,
		public batchDestination?: Batch
	) {
		if (wareHouse) {
			this.wareHouse = Warehouse.fromData(wareHouse);
		}
		if (positionDestination) {
			this.positionDestination = Position.fromData(positionDestination);
		}
		if (positionOrigin) {
			this.positionOrigin = Position.fromData(positionOrigin);
		}
		if (tagOperation1) {
			this.tagOperation1 = EquipamentTag.fromData(tagOperation1);
		}
		if (tagOperation2) {
			this.tagOperation2 = EquipamentTag.fromData(tagOperation2);
		}
		if (tagFinalization1) {
			this.tagFinalization1 = EquipamentTag.fromData(tagFinalization1);
		}
		if (tagFinalization2) {
			this.tagFinalization2 = EquipamentTag.fromData(tagFinalization2);
		}
		if (batchOrigin) {
			this.batchOrigin = Batch.fromData(batchOrigin);
		}
		if (batchDestination) {
			this.batchDestination = Batch.fromData(batchDestination);
		}

		this.getTypeRouteItem();
	}

	get positionOriginObject(): Position {
		return this.positionOrigin;
	}

	get automationStatusName() {
		if (
			this.status === 'BAGGING' ||
			this.status === 'RECEIVING' ||
			this.status === 'TRANSFERRING' ||
			this.status === 'DUMPING'
		) {
			this.automationStatus = AutomationStatus.fromData(
				'EQUIPAMENT_IN_PROCESS'
			);
		} else if (
			this.status === 'FINALIZING' ||
			(this.status === 'INACTIVE' &&
				this.batchCodeOrigin &&
				this.positionOrigin.type !== 'S')
		) {
			this.automationStatus = AutomationStatus.fromData('EQUIPAMENT_OCCUPIED');
		} else if (
			this.status === 'INACTIVE' &&
			this.batchCodeDestination &&
			this.batchCodeOrigin
		) {
			this.automationStatus = AutomationStatus.fromData(
				'EQUIPAMENT_IN_PROCESS'
			);
		} else if (this.status === 'INACTIVE') {
			this.automationStatus = AutomationStatus.fromData('FREE');
		}

		if (!this.automationStatus) {
			this.automationStatus = AutomationStatus.fromData('FREE');
		}
		return this.automationStatus;
	}

	get automationStatusNotification() {
		if (
			this.status === 'BAGGING' ||
			this.status === 'RECEIVING' ||
			this.status === 'TRANSFERRING' ||
			this.status === 'DUMPING' ||
			this.status === 'FINALIZING'
		) {
			this.automationStatus = AutomationStatus.fromData(
				'EQUIPAMENT_IN_PROCESS'
			);
		} else if (
			(this.status === 'INACTIVE' && this.batchCodeOrigin) ||
			this.batchCodeOrigin
		) {
			this.automationStatus = AutomationStatus.fromData('EQUIPAMENT_OCCUPIED');
		} else if (
			this.status === 'INACTIVE' &&
			this.batchCodeDestination &&
			this.batchCodeOrigin
		) {
			this.automationStatus = AutomationStatus.fromData(
				'EQUIPAMENT_IN_PROCESS'
			);
		} else if (this.status === 'INACTIVE') {
			this.automationStatus = AutomationStatus.fromData('FREE');
		}

		if (!this.automationStatus) {
			this.automationStatus = AutomationStatus.fromData('FREE');
		}
		return this.automationStatus;
	}

	get statusCurrent(): string {
		if (this.status) {
			switch (this.status) {
				case 'INACTIVE':
					return 'Inativa';
				case 'BAGGING':
					return (
						this.positionOrigin.name +
						' Embegando para ' +
						this.positionDestination.name
					);
				case 'RECEIVING':
					return (
						this.positionDestination.name +
						' Recebendo de ' +
						this.positionOrigin.name
					);
				case 'TRANSFERRING':
					return (
						this.positionOrigin.name +
						' Transferindo para ' +
						this.positionDestination.name
					);
				case 'DUMPING':
					return (
						this.positionOrigin.name +
						' Despejando para ' +
						this.positionDestination.name
					);
				case 'FINALIZING':
					if (this.typeRouteEquipment === TypeRouteEquipment.SILO_SILO) {
						return 'Finalizando Transferência ';
					} else if (
						this.typeRouteEquipment === TypeRouteEquipment.SILO_EMBEGADORA
					) {
						return 'Finalizando  Embegamento';
					} else if (
						this.typeRouteEquipment === TypeRouteEquipment.MOEGA_GRANEL
					) {
						return 'Finalizando  Despejo';
					} else if (
						this.typeRouteEquipment === TypeRouteEquipment.MOEGA_SILO
					) {
						return 'Finalizando  Recebimento';
					}
				default:
					return '';
			}
		} else {
			return '';
		}
	}
	private getTypeRouteItem() {
		if (this.positionOrigin && this.positionDestination) {
			var origin = this.positionOrigin.type;
			var destination = this.positionDestination.type;
			if (origin === 'S') {
				if (destination === 'S') {
					this.typeRouteEquipment = TypeRouteEquipment.SILO_SILO;
				} else if (destination === 'E') {
					this.typeRouteEquipment = TypeRouteEquipment.SILO_EMBEGADORA;
				} else if (destination === 'G') {
					this.typeRouteEquipment = TypeRouteEquipment.SILO_GRANEL;
				}
			} else if (origin === 'M') {
				if (destination === 'S') {
					this.typeRouteEquipment = TypeRouteEquipment.MOEGA_SILO;
				} else if (destination === 'G') {
					this.typeRouteEquipment = TypeRouteEquipment.MOEGA_GRANEL;
				} else if (destination === 'E') {
					this.typeRouteEquipment = TypeRouteEquipment.MOEGA_EMBEGADORA;
				}
			}
		}
	}
	get getRouteItemStatus(): RouteItemStatus {
		return RouteItemStatus.fromData(this.status);
	}
}
