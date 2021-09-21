import { NumberHelper } from '../shared/globalization';
import { User } from '../user/user';
import { ClassificationVersion } from './classification-version';
import { Sample } from '../sample/sample';
import { BatchOperation } from '../batch-operation/batch-operation';

export class Classification {
	static fromListData(listData: Array<Classification>): Array<Classification> {
		return listData.map(data => {
			return Classification.fromData(data);
		});
	}

	static fromData(data?: Classification): Classification {
		if (!data) {
			return new this();
		}

		const classification = new this(
			data.id,
			data.sample,
			data.classificationVersion,
			data.batchOperation,
			data.indicationSpecialCoffee,
		);

		return classification;
	}

	constructor(
		public id?: string,
		public sample?: Sample,
		public classificationVersion?: ClassificationVersion,
		public batchOperation?: BatchOperation,
		public indicationSpecialCoffee?: boolean
	) {
		if (sample) {
			this.sample = Sample.fromData(sample);
		}

		if (batchOperation) {
			this.batchOperation = BatchOperation.fromData(batchOperation);
		}

		if (classificationVersion) {
			this.classificationVersion = ClassificationVersion.fromData(
				classificationVersion
			);
		}
	}

	setIndicationSpecialCoffee(isIndication: boolean) {
		this.indicationSpecialCoffee = isIndication;
	}
}
