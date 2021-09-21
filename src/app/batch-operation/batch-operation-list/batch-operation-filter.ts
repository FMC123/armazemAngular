import { BatchOperationStatus } from '../batch-operation-status';
import { DateTimeHelper } from '../../shared/globalization';
import { URLSearchParams } from '@angular/http';

export class BatchOperationFilter {

	static fromListData(
		listData: Array<BatchOperationFilter>
	): Array<BatchOperationFilter> {
		return listData.map(data => {
			return BatchOperationFilter.fromData(data);
		});
	}

	static fromData(data: BatchOperationFilter): BatchOperationFilter {
		if (!data) return new this();

		let filter = new this(
			data.createdDateStartString,
			data.createdDateEndString,
			data.batchOperationCode,
			data.ownerStakeholderId,
			data.status,
			data.type,
			data.fiscalNote,
			data.sellCode,
			data.batchCode,
			data.codeOrName,
		);

		return filter;
	}

	constructor(
		public createdDateStartString?: string,
		public createdDateEndString?: string,
		public batchOperationCode?: string,
		public ownerStakeholderId?: string,
		public status?: any[],
		public type?: any[],
		public fiscalNote?: string,
		public sellCode?: string,
		public batchCode?: string,
		public codeOrName?: string,
	) {}

	get createdDateStart(): number {
		return DateTimeHelper.fromDDMMYYYY(this.createdDateStartString);
	}
	set createdDateStart(value: number) {
		this.createdDateStartString = DateTimeHelper.toDDMMYYYY(value);
	}

	get createdDateEnd(): number {
		return DateTimeHelper.fromDDMMYYYY(this.createdDateEndString);
	}
	set createdDateEnd(value: number) {
		this.createdDateEndString = DateTimeHelper.toDDMMYYYY(value);
	}

	public toURLSearchParams(): URLSearchParams {
		let params: URLSearchParams = new URLSearchParams();

		if (this.createdDateStart) {
			params.set('createdDateStart', this.createdDateStart + '');
		}

		if (this.createdDateEnd) {
			params.set('createdDateEnd', this.createdDateEnd + '');
		}

		if (this.ownerStakeholderId) {
			params.set('ownerStakeholderId', this.ownerStakeholderId);
		}

		if (this.batchOperationCode) {
			params.set('batchOperationCode', this.batchOperationCode);
		}

		if (this.status) {
      if (this.status && this.status.length) {
			  params.set('status', this.status.map(i => i.id).join(','));
      }
		}

		if (this.type) {
		  if (this.type && this.type.length) {
			  params.set('type', this.type.map(i => i.id).join(','));
      }
		}

		if (this.fiscalNote) {
			params.set('fiscalNote', this.fiscalNote);
		}

		if (this.sellCode) {
			params.set('sellCode', this.sellCode);
		}

		if (this.batchCode) {
			params.set('batchCode', this.batchCode);
		}

		if (this.codeOrName) {
			params.set('codeOrName', this.codeOrName);
		}
		return params;
	}
}
