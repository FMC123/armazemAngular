import { Batch } from './../batch/batch';
import { Warehouse } from './../warehouse/warehouse';
import { PositionType } from './position-type';
import { PositionLayer } from '../position-layer/position-layer';
import { NumberHelper } from '../shared/globalization/number-helper';
import { StorageUnitBatch } from 'app/storage-unit/storage-unit-batch';

export class Position {
	static fromListData(listData: Array<Position>): Array<Position> {
		return listData.map(data => {
			return Position.fromData(data);
		});
	}

	static fromData(data: any): Position {
		if (!data) return new this();
		let position = new this(
			data.id,
			data.warehouse,
			data.code,
			data.yCoordinate,
			data.xCoordinate,
			data.height,
			data.width,
			data.type,
			data.sortOrder,
			data.rotation,
			data.groupId,
			data.name,
			data.automationBatch,
			data.positionLayer,
			data.embegadora,
			data.color,
			data.active,
			data.rfidCode0,
			data.rfidCode1,
			data.sotageUnitBatches
		);
		return position;
	}

	constructor(
		public id?: string,
		public warehouse?: Warehouse,
		public code?: string,
		public yCoordinate?: number,
		public xCoordinate?: number,
		public height?: number,
		public width?: number,
		public type?: string,
		public sortOrder?: number,
		public rotation?: number,
		public groupId?: number,
		public name?: string,
		public automationBatch?: Batch,
		public positionLayer?: PositionLayer,
		public embegadora?: Position,
		public color?: string,
		public active?: boolean,
		public rfidCode0?: string,
		public rfidCode1?: string,
		public sotageUnitBatches?: Array<StorageUnitBatch>
	) {
		if (warehouse) {
			this.warehouse = Warehouse.fromData(warehouse);
		}
		if (automationBatch) {
			this.automationBatch = Batch.fromData(automationBatch);
		}
		if (positionLayer) {
			this.positionLayer = PositionLayer.fromData(positionLayer);
		}
		if (embegadora) {
			this.embegadora = Position.fromData(embegadora);
		}

		if (sotageUnitBatches) {
			this.sotageUnitBatches = StorageUnitBatch.fromListData(sotageUnitBatches);
		}
	}

	get isSilo() {
		return this.type &&
			(this.typeObject.code === PositionType.SILO.code ||
				this.typeObject.code === PositionType.ARMAZENAMENTO_SILO.code);
	}

	get isDescriptive() {
	  return this.type && this.typeObject.code === PositionType.DESCRITIVO.code;
  }

	get nameCode() {
		return this.name ? this.name : this.code;
	}

	get typeObject(): PositionType {
		return PositionType.fromData(this.type);
	}
	set typeObject(value: PositionType) {
		if (value) {
			this.type = value.code;
		} else {
			this.type = null;
		}
	}

	get yCoordinateString(): string {
		return NumberHelper.toPTBR(this.yCoordinate);
	}
	set yCoordinateString(yCoordinateString: string) {
		this.yCoordinate = NumberHelper.fromPTBR(yCoordinateString);
	}

	get xCoordinateString(): string {
		return NumberHelper.toPTBR(this.xCoordinate);
	}
	set xCoordinateString(xCoordinateString: string) {
		this.xCoordinate = NumberHelper.fromPTBR(xCoordinateString);
	}

	get heightString(): string {
		return NumberHelper.toPTBR(this.height);
	}
	set heightString(heightString: string) {
		this.height = NumberHelper.fromPTBR(heightString);
	}

	get widthString(): string {
		return NumberHelper.toPTBR(this.width);
	}
	set widthString(widthString: string) {
		this.width = NumberHelper.fromPTBR(widthString);
	}

	get sortOrderString(): string {
		return NumberHelper.toPTBR(this.sortOrder);
	}
	set sortOrderString(sortOrderString: string) {
		this.sortOrder = NumberHelper.fromPTBR(sortOrderString);
	}

	get rotationString(): string {
		return NumberHelper.toPTBR(this.rotation);
	}
	set rotationString(rotationString: string) {
		this.rotation = NumberHelper.fromPTBR(rotationString);
	}

	get activeAsString(): string {
		if (this.active) {
			return 'SIM';
		} else {
			return 'NÃO';
		}
	}
}
