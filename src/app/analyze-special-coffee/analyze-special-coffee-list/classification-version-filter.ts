import { URLSearchParams } from '@angular/http';

export class ClassificationVersionFilter {
	static fromListData(
		listData: Array<ClassificationVersionFilter>
	): Array<ClassificationVersionFilter> {
		return listData.map(data => {
			return ClassificationVersionFilter.fromData(data);
		});
	}

	static fromData(data: ClassificationVersionFilter): ClassificationVersionFilter {
		if (!data) return new this();
		let filter = new this(
		  data.barcode,
			data.batchCode,
			data.specialCoffeeSituation
		);
		return filter;
	}

	constructor(
	  public barcode?: string,
    public batchCode?: string,
    public specialCoffeeSituation?: string
	) { }

	public toURLSearchParams(): URLSearchParams {
		let params: URLSearchParams = new URLSearchParams();

    if (this.barcode) {
      params.set('barcode', this.barcode);
    }

		if (this.batchCode) {
			params.set('batchCode', this.batchCode);
		}

		if (this.specialCoffeeSituation != null) {
			params.set('specialCoffeeSituation', String(this.specialCoffeeSituation));
		}

    return params;
	}
}
