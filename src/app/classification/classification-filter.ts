import { URLSearchParams } from '@angular/http';

export class ClassificationFilter {
	static fromListData(
		listData: Array<ClassificationFilter>
	): Array<ClassificationFilter> {
		return listData.map(data => {
			return ClassificationFilter.fromData(data);
		});
	}

	static fromData(data: ClassificationFilter): ClassificationFilter {
		if (!data) return new this();
		let filter = new this(data.barCode, data.batch, data.collaboratorId);
		return filter;
	}

	constructor(
		public barCode?: string,
		public batch?: string,
		public collaboratorId?: string
	) {}

	public toURLSearchParams(): URLSearchParams {
		let params: URLSearchParams = new URLSearchParams();

		if (this.barCode) {
			params.set('barCode', this.barCode);
		}

		if (this.collaboratorId) {
			params.set('collaboratorId', this.collaboratorId);
		}

		if (this.batch) {
			params.set('batch', this.batch);
		}

		return params;
	}
}
