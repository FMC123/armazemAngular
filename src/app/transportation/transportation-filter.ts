import { Scale } from '../scale/scale';
import { DateTimeHelper } from '../shared/globalization';

import { URLSearchParams } from '@angular/http';

export class TransportationFilter {
	static fromData(data: TransportationFilter): TransportationFilter {
		if (!data) return new this();
		let transportationFilter = new this(
			data.type,
			data.status,
			data.arriveDate,
			data.vehiclePlate1,
			data.driverName,
			data.fiscalNote,
			data.sellCode,
			data.batchCode,
			data.batchOperationCode,
			data.statusList
		);
		return transportationFilter;
	}

	constructor(
		public type?: string,
		public status?: string,
		public arriveDate?: number,
		public vehiclePlate1?: string,
		public driverName?: string,
		public fiscalNote?: string,
		public sellCode?: string,
		public batchCode?: string,
		public batchOperationCode?: string,
		public statusList?: Array<string>
	) { }

	set arriveDateString(value) {
		this.arriveDate = DateTimeHelper.fromDDMMYYYY(value);
	}

	get arriveDateString() {
		if (!this.arriveDate) {
			return null;
		}

		return DateTimeHelper.toDDMMYYYY(this.arriveDate);
	}

	public toURLSearchParams(): URLSearchParams {
		let params: URLSearchParams = new URLSearchParams();

		if (this.status) {
			params.set('status', this.status);
		}

		if (this.type) {
			params.set('type', this.type);
		}

		if (this.arriveDate) {
			params.set('arriveDateNumber', this.arriveDate + '');
		}

		if (this.vehiclePlate1) {
			params.set('vehiclePlate1', this.vehiclePlate1);
		}

		if (this.driverName) {
			params.set('driverName', this.driverName);
		}

		if (this.sellCode) {
			params.set('sellCode', this.sellCode);
		}

		if (this.fiscalNote) {
			params.set('fiscalNote', this.fiscalNote);
		}

		if (this.batchCode) {
			params.set('batchCode', this.batchCode);
		}

		if (this.batchOperationCode) {
			params.set('batchOperationCode', this.batchOperationCode);
		}

		if (this.statusList) {
			params.set('statusList', this.statusList.join());
		}

		return params;
	}
}