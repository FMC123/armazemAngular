import { DateTimeHelper } from '../shared/globalization';
import { City } from '../city/city';
import { WarehouseStakeholder } from '../warehouse-stakeholder/warehouse-stakeholder';
import { PackType } from '../pack-type/pack-type';
import { Warehouse } from 'app/warehouse/warehouse';
import { PurchaseOrderStatus } from './purchase-order-status';

export class PurchaseOrder {

	static fromListData(listData: Array<PurchaseOrder>): Array<PurchaseOrder> {

		if (listData == null) {
			return [];
		}

		return listData.map(data => {
			return PurchaseOrder.fromData(data);
		});
	}

	static fromData(data: any): PurchaseOrder {

		if (!data) return new this();

		let PurchaseOrder = new this(
			data.id,
			data.loadingDate,
			data.downloadForecastDate,
			data.sacksQuantity,
			data.purchaseOrderCode,
			data.dischargedQuantity,
			data.loadingCity,
			data.packType,
			data.client,
			data.salesman,
			data.loadingWarehouse,
			data.status,
			false,
		);

		return PurchaseOrder;
	}

	constructor(
		public id?: string,
		public loadingDate?: number,
		public downloadForecastDate?: number,
		public sacksQuantity?: number,
		public purchaseOrderCode?: string,
		public dischargedQuantity?: number,
		public loadingCity?: City,
		public packType?: PackType,
		public client?: WarehouseStakeholder,
		public salesman?: WarehouseStakeholder,
		public loadingWarehouse?: Warehouse,
		public status?: string,
		// para mostrar informações na página
		public showDetailsInformation?: boolean,
	) {
		if (loadingCity) {
			this.loadingCity = City.fromData(loadingCity);
		}

		if (packType) {
			this.packType = PackType.fromData(packType);
		}

		if (client) {
			this.client = WarehouseStakeholder.fromData(client);
		}

		if (salesman) {
			this.salesman = WarehouseStakeholder.fromData(salesman);
		}

		if (loadingWarehouse) {
			this.loadingWarehouse = Warehouse.fromData(loadingWarehouse);
		}
	}

	get loadingDateString(): string {
		return DateTimeHelper.toDDMMYYYY(this.loadingDate);
	}

	set loadingDateString(loadingDateString: string) {
		this.loadingDate = DateTimeHelper.fromDDMMYYYY(loadingDateString);
	}

	get downloadForecastDateString(): string {
		return DateTimeHelper.toDDMMYYYY(this.downloadForecastDate);
	}

	set downloadForecastDateString(downloadForecastDateString: string) {
		this.downloadForecastDate = DateTimeHelper.fromDDMMYYYY(downloadForecastDateString);
	}

	get statusLabel(): string {
		return PurchaseOrderStatus.fromData(this.status).name;
	}

	get statusCollor(): string {
		return PurchaseOrderStatus.fromData(this.status).collor;
	}
}