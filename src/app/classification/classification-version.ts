import { DateTimeHelper } from '../shared/globalization';
import { User } from '../user/user';
import { ClassificationItem } from './classification-item';
import { Sample } from '../sample/sample';
import { ClassificationType } from './classification-type';
import {ClassificationProcessStatus} from "./classification-process-status";
import {ClassificationRequirementItem} from "./classification-requirement-item";

export class ClassificationVersion {

	/**
	 * Todos os tipos, para validações
	 */
	allTypes: Array<ClassificationType>;

	static fromListData(listData: Array<ClassificationVersion>): Array<ClassificationVersion> {
		return listData.map(data => {
			return ClassificationVersion.fromData(data);
		});
	}

	static fromData(data?: ClassificationVersion): ClassificationVersion {
		if (!data) {
			return new this();
		}

		const classificationVersion = new this(
			data.id,
			data.version,
			data.classificationDate,
			data.classifiedBy,
			data.tastedBy,
			data.tastedAgain1By,
			data.tastedAgain2By,
			data.tastedAgain3By,
			data.observation,
			data.items,
			data.sample,
			data.analyzedBy,
			data.analyzedDate,
			data.authorized,
			data.hasOtherVersions,
			data.specialCoffee,
      data.classificationProcessStatus,
      data.sampleRequestedBy,
      data.sampleReceivedBy,
      data.actualVersion,
      data.listRequirementItem,
      data.analyzedSpecialBy,
      data.analyzedSpecialDate
		);

		return classificationVersion;
	}

	constructor(
		public id?: string,
		public version?: number,
		public classificationDate?: number,
		public classifiedBy?: User,
		public tastedBy?: User,
		public tastedAgain1By?: User,
		public tastedAgain2By?: User,
		public tastedAgain3By?: User,
		public observation?: string,
		public items?: Array<ClassificationItem>,
		public sample?: Sample,
		public analyzedBy?: User,
		public analyzedDate?: number,
		public authorized?: boolean,
		public hasOtherVersions?: Boolean,
		public specialCoffee?: Boolean,
    public classificationProcessStatus?: string,
    public sampleRequestedBy?: User,
    public sampleReceivedBy?: User,
    public actualVersion?: number,
    public listRequirementItem?: Array<ClassificationRequirementItem>,
    public analyzedSpecialBy?: User,
    public analyzedSpecialDate?: number
	) {
		if (classifiedBy) {
			this.classifiedBy = User.fromData(classifiedBy);
		}

		if (tastedBy) {
			this.tastedBy = User.fromData(tastedBy);
		}

		if (tastedAgain1By) {
			this.tastedAgain1By = User.fromData(tastedAgain1By);
		}

		if (tastedAgain2By) {
			this.tastedAgain2By = User.fromData(tastedAgain2By);
		}

		if (tastedAgain3By) {
			this.tastedAgain3By = User.fromData(tastedAgain3By);
		}

		if (items) {
			this.items = ClassificationItem.fromListData(items);
		} else {
			this.items = [];
		}

		if (sample) {
			this.sample = Sample.fromData(sample);
		}

		if (analyzedBy) {
			this.analyzedBy = User.fromData(analyzedBy);
		}

    if (listRequirementItem) {
      this.listRequirementItem = ClassificationRequirementItem.fromListData(listRequirementItem)
    }

    if (analyzedSpecialBy) {
      this.analyzedSpecialBy = User.fromData(analyzedSpecialBy);
    }
	}

	get classificationDateString(): string {
		return DateTimeHelper.toDDMMYYYY(this.classificationDate);
	}

	set classificationDateString(classificationDateString: string) {
		this.classificationDate = DateTimeHelper.fromDDMMYYYY(classificationDateString);
	}

	get analyzedDateString(): string {
		return DateTimeHelper.toDDMMYYYYHHmm(this.analyzedDate);
	}

	set analyzedDateString(analyzedDateString: string) {
		this.analyzedDate = DateTimeHelper.fromDDMMYYYYHHmm(analyzedDateString);
	}

  get analyzedSpecialDateString(): string {
    return DateTimeHelper.toDDMMYYYYHHmm(this.analyzedSpecialDate);
  }

  set analyzedSpecialDateString(analyzedSpecialDateString: string) {
    this.analyzedSpecialDate = DateTimeHelper.fromDDMMYYYYHHmm(analyzedSpecialDateString);
  }

  get authorizedString() {
		if (this.authorized != null) {
			return this.authorized ? 'Sim' : 'Não'
		}
		return 'Aguardando';
	}

  get classificationProcessStatusObject() {
    return ClassificationProcessStatus.fromData(this.classificationProcessStatus);
  }

  get specialCoffeeSituationObject() {
	  let value = "undefined"
    this.items.forEach(classificationItem => {
      if(classificationItem.classificationType.name == "Situação Café Especial")
      {
        value = classificationItem.value;
      }
    });

    return value;
  }
}
