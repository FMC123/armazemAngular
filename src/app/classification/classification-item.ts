import {DateTimeHelper, NumberHelper} from '../shared/globalization';
import { User } from '../user/user';
import { ClassificationType } from './classification-type';
import { ClassificationValue } from './classification-value';
import {SamplePack} from "../sample-pack/sample-pack";

export class ClassificationItem {
	static fromListData(
		listData: Array<ClassificationItem>
	): Array<ClassificationItem> {
		return listData.map(data => {
			return ClassificationItem.fromData(data);
		});
	}

	static fromData(data?: ClassificationItem): ClassificationItem {
		if (!data) {
			return new this();
		}

		const classificationItem = new this(
			data.id,
			data.classificationType,
			data.value,
			data.classificationDate,
			data.classifiedBy
		);

		return classificationItem;
	}

	constructor(
		public id?: string,
		public classificationType?: ClassificationType,
		public value?: string,
		public classificationDate?: number,
		public classifiedBy?: User
	) {
		if (classifiedBy) {
			this.classifiedBy = User.fromData(classifiedBy);
		}
    if (classificationType) {
      this.classificationType = ClassificationType.fromData(classificationType);
    }

  }

	get classificationDateString(): string {
		return DateTimeHelper.toDDMMYYYY(this.classificationDate);
	}

	set classificationDateString(classificationDateString: string) {
		this.classificationDate = DateTimeHelper.fromDDMMYYYY(
			classificationDateString
		);
  }

  get valueInNumber(){
    return NumberHelper.fromPTBR(this.value);
  }

  validate() {
    return this.value && this.value.length;
  }

}
