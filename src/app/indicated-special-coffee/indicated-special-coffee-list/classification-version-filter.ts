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
			data.classifiedById,
      data.batchCode,
			data.classificationProcessStatus
		);
		return filter;
	}

	constructor(
		public classifiedById?: string,
    public batchCode?: string,
		public classificationProcessStatus?: string
	) { }

	public toURLSearchParams(): URLSearchParams {
		let params: URLSearchParams = new URLSearchParams();

		if (this.classifiedById) {
			params.set('classifiedById', this.classifiedById);
		}

    if (this.batchCode) {
      params.set('batchCode', this.batchCode);
    }

		if (this.classificationProcessStatus != null) {
			params.set('classificationProcessStatus', String(this.classificationProcessStatus));
		}

		return params;
	}
}
