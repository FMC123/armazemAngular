import { Batch } from '../batch/batch';
import { Warehouse } from '../warehouse/warehouse';
import { SamplePack } from '../sample-pack/sample-pack';
import { User } from '../user/user';
import { DateTimeHelper } from '../shared/globalization';
import { NumberHelper } from './../shared/globalization/number-helper';
import { SampleStatus } from './sample-status';
import { ClassificationVersion } from 'app/classification/classification-version';
import {Department} from "../department/department";
import {SampleMovementType} from "./sample-movement-type";
import {Sample} from "./sample";

export class SampleMovementHistory {
	public selected: boolean = false;

	static fromListData(listData: Array<SampleMovementHistory>): Array<SampleMovementHistory> {
		return listData.map(data => {
			return SampleMovementHistory.fromData(data);
		});
	}

	static fromData(data: SampleMovementHistory): SampleMovementHistory {
		if (!data) return new this();
		const parameter = new this(
			data.id,
      data.departmentRequestBy,
      data.movementedBy,
      data.movementDate,
      data.movementType,
      data.conclude,
			data.sample,
			data.movementDescription,
      data.quantity
		);

		return parameter;
	}

	constructor(
		public id?: string,
		public departmentRequestBy?: Department,
		public movementedBy?: User,
		public movementDate?: number,
    public movementType?: string,
    public conclude?: boolean,
    public sample?: Sample,
    public movementDescription?: string,
    public quantity?: number
	) {
		if (departmentRequestBy) {
			this.departmentRequestBy = Department.fromData(departmentRequestBy);
		}

    if (movementedBy) {
      this.movementedBy = User.fromData(movementedBy);
    }

		if (sample) {
			this.sample = Sample.fromData(sample);
		}
	}

	get movementTypeLabel(): SampleMovementType {
	  return SampleMovementType.fromData(this.movementType);
	}
	get movementDateString(): string {
		return DateTimeHelper.toDDMMYYYYHHmm(this.movementDate);
	}

	set movementDateString(movementDateString: string) {
		this.movementDate = DateTimeHelper.fromDDMMYYYYHHmm(movementDateString);
	}

	get concludeString() {
		return this.conclude ? 'Sim' : 'Não';
	}

  get quantityString(): string {
    return NumberHelper.toPTBR(this.quantity);
  }
  set quantityString(quantityString: string) {
    this.quantity = NumberHelper.fromPTBR(quantityString);
  }

}
