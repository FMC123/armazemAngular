import { DateTimeHelper } from '../../shared/globalization';
import { URLSearchParams } from '@angular/http';

export class BatchSwapHistoryFilter {

	static fromListData(
		listData: Array<BatchSwapHistoryFilter>
	): Array<BatchSwapHistoryFilter> {
		return listData.map(data => {
			return BatchSwapHistoryFilter.fromData(data);
		});
	}

	static fromData(data: BatchSwapHistoryFilter): BatchSwapHistoryFilter {
		if (!data) return new this();

		let filter = new this(
			data.createdDateStartString,
			data.createdDateEndString,
			data.type,
			data.clientId,
			data.clientName,
			data.originBatchId,
			data.originBatchCode,
			data.destinationBatchId,
			data.destinationBatchCode,
		);

		return filter;
	}

	constructor(
		public createdDateStartString?: string,
		public createdDateEndString?: string,
		public type?: string,
		public clientId?: string,
		public clientName?: string,
		public originBatchId?: string,
		public originBatchCode?: string,
		public destinationBatchId?: string,
		public destinationBatchCode?: string,
	) {}

	get startDate(): number {
		return DateTimeHelper.fromDDMMYYYY(this.createdDateStartString);
	}
	set startDate(value: number) {
		this.createdDateStartString = DateTimeHelper.toDDMMYYYY(value);
	}

	get endDate(): number {
		return DateTimeHelper.fromDDMMYYYY(this.createdDateEndString);
	}

	set endDate(value: number) {
		this.createdDateEndString = DateTimeHelper.toDDMMYYYY(value);
	}

	public toURLSearchParams(): URLSearchParams {
		let params: URLSearchParams = new URLSearchParams();

		if (this.startDate) {
			params.set('startDate', this.startDate + '');
		}

		if (this.endDate) {
			params.set('endDate', this.endDate + '');
		}

		if (this.clientId) {
			params.set('clientId', this.clientId);
		}

		if (this.clientName) {
			params.set('clientName', this.clientName);
		}

		if (this.type) {
    	params.set('type', this.type);
		}

		if (this.originBatchId) {
			params.set('originBatchId', this.originBatchId);
		}

		if (this.originBatchCode) {
			params.set('originBatchCode', this.originBatchCode);
		}

    if (this.destinationBatchId) {
      params.set('destinationBatchId', this.destinationBatchId);
    }

    if (this.destinationBatchCode) {
      params.set('destinationBatchCode', this.destinationBatchCode);
    }

    return params;
	}
}
