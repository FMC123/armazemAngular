import { DateTimeHelper } from '../../shared/globalization';
import { URLSearchParams } from '@angular/http';

export class PurchaseForecastFilter {
	static fromListData(
		listData: Array<PurchaseForecastFilter>
	): Array<PurchaseForecastFilter> {
		return listData.map(data => {
			return PurchaseForecastFilter.fromData(data);
		});
	}

	static fromData(data: PurchaseForecastFilter): PurchaseForecastFilter {
		if (!data) return new this();
		let filter = new this(
			data.ownerStakeholderId,
			data.carrierId,
			data.driverName,
			data.vehiclePlate1,
			data.vehiclePlate2,
			data.originWeight,
			data.barCode,
			data.fiscalNoteCode,
			data.emissionDateString,
			data.quantity,
			data.unitPrice,
			data.collaboratorId,
			data.farmId,
			data.nameCollaborator,
			data.numberCollaborator,
			data.forecastDateStart,
			data.forecastDateEnd,
			data.status,
      data.warehouseId
		);
		return filter;
	}

	constructor(
		public ownerStakeholderId?: string,
		public carrierId?: string,
		public driverName?: string,
		public vehiclePlate1?: string,
		public vehiclePlate2?: string,
		public originWeight?: string,
		public barCode?: string,
		public fiscalNoteCode?: string,
		public emissionDateString?: string,
		public quantity?: number,
		public unitPrice?: number,
		public collaboratorId?: string,
		public farmId?: string,
		public nameCollaborator?: string,
		public numberCollaborator?: string,
		public forecastDateStart?: string,
		public forecastDateEnd?: string,
		public status?: string,
    public warehouseId?: string
	) {}

	public toURLSearchParams(): URLSearchParams {
		let params: URLSearchParams = new URLSearchParams();

		if (this.ownerStakeholderId) {
			params.set('ownerStakeholderId', this.ownerStakeholderId);
		}

		if (this.carrierId) {
			params.set('carrierId', this.carrierId);
		}

		if (this.driverName) {
			params.set('driverName', this.driverName);
		}

		if (this.vehiclePlate1) {
			params.set('vehiclePlate1', this.vehiclePlate1);
		}

		if (this.vehiclePlate2) {
			params.set('vehiclePlate2', this.vehiclePlate2);
		}

		if (this.originWeight) {
			params.set('originWeight', this.originWeight + '');
		}

		if (this.barCode) {
			params.set('barCode', this.barCode);
		}

		if (this.fiscalNoteCode) {
			params.set('fiscalNoteCode', this.fiscalNoteCode);
		}

		if (this.emissionDateString) {
			params.set(
				'emissionDate',
				String(DateTimeHelper.fromDDMMYYYY(this.emissionDateString))
			);
		}

		if (this.forecastDateStart) {
			params.set(
				'forecastDateStart',
				String(DateTimeHelper.fromDDMMYYYY(this.forecastDateStart))
			);
		}

		if (this.forecastDateEnd) {
			params.set(
				'forecastDateEnd',
				String(DateTimeHelper.fromDDMMYYYY(this.forecastDateEnd))
			);
		}

		if (this.quantity) {
			params.set('quantity', this.quantity + '');
		}

		if (this.unitPrice) {
			params.set('unitPrice', this.unitPrice + '');
		}

		if (this.collaboratorId) {
			params.set('collaboratorId', this.collaboratorId);
		}

		if (this.farmId) {
			params.set('farmId', this.farmId);
		}

		if (this.numberCollaborator) {
			params.set('numberCollaborator', this.numberCollaborator);
		}

		if (this.nameCollaborator) {
			params.set('nameCollaborator', this.nameCollaborator);
		}

		if (this.status) {
			params.set('status', this.status);
		}

		if (this.warehouseId) {
		  params.set('warehouseId', this.warehouseId)
    }

		return params;
	}
}
