import { URLSearchParams } from '@angular/http';

export class SampleListFilter {
	static fromListData(
		listData: Array<SampleListFilter>
	): Array<SampleListFilter> {
		return listData.map(data => {
			return SampleListFilter.fromData(data);
		});
	}

	static fromData(data: SampleListFilter): SampleListFilter {
		if (!data) return new this();
		let filter = new this(
			data.barcode,
			data.reservation,
			data.batchCode,
			data.warehouseId,
			data.departmentId,
			data.includeNotInStock,
			data.onlyArchived,
			data.indicationSpecialCoffee,
      data.showConclude
		);
		return filter;
	}

	constructor(
		public barcode?: string,
		public reservation?: string,
		public batchCode?: string,
		public warehouseId?: string,
		public departmentId?: string,
		public includeNotInStock?: boolean,
		public onlyArchived?: boolean,
		public indicationSpecialCoffee?: string,
    public showConclude?: boolean
	) { }

	public toURLSearchParams(): URLSearchParams {
		let params: URLSearchParams = new URLSearchParams();

		if (this.barcode) {
			params.set('barcode', encodeURIComponent(this.barcode));
		}

		if (this.reservation) {
			params.set('reservation', this.reservation);
		}

		if (this.batchCode) {
			params.set('batchCode', encodeURIComponent(this.batchCode));
		}

		if (this.warehouseId) {
			params.set('warehouseId', this.warehouseId);
		}

		if (this.departmentId) {
			params.set('departmentId', this.departmentId);
		}

		if (this.includeNotInStock) {
			params.set('includeNotInStock', String(this.includeNotInStock));
		}

		if (this.onlyArchived) {
			params.set('onlyArchived', String(this.onlyArchived));
		}

		if (this.indicationSpecialCoffee != null) {
			params.set('indicationSpecialCoffee', String(this.indicationSpecialCoffee));
		}

    if (this.showConclude) {
      params.set('showConclude', String(this.showConclude));
    }

		return params;
	}
}
