import { Batch } from '../batch/batch';
import { Warehouse } from '../warehouse/warehouse';
import { SamplePack } from '../sample-pack/sample-pack';
import { User } from '../user/user';
import { DateTimeHelper } from '../shared/globalization';
import { NumberHelper } from './../shared/globalization/number-helper';
import { SampleStatus } from './sample-status';
import { ClassificationVersion } from 'app/classification/classification-version';
import {SampleMovementHistory} from "./sample-movement-history";
import {Subscription} from "rxjs";
import {SampleMovementType} from "./sample-movement-type";

export class Sample {
	public selected: boolean = false;

	static fromListData(listData: Array<Sample>): Array<Sample> {
		return listData.map(data => {
			return Sample.fromData(data);
		});
	}

	static fromData(data: Sample): Sample {
		if (!data) return new this();
		const parameter = new this(
			data.id,
			data.status,
			data.motive,
			data.barcode,
			data.batches,
			data.sacks,
			data.collectedDate,
			data.samplePack,
			data.warehouse,
			data.collectedBy,
			data.withdrawalRequestedBy,
			data.movementedResponsible,
			data.movementedBy,
			data.movementDate,
			data.lastModified,
			data.movementType,
			data.indicationSpecialCoffee,
			data.sacksInteger,
			data.lastClassificationVersionAuthorized,
      data.sampleMovementsHistory
		);

		if (data.samplePack) {
			parameter.selected = true;
		}
		return parameter;
	}

	constructor(
		public id?: string,
		public status?: string,
		public motive?: string,
		public barcode?: string,
		public batches?: Array<Batch>,
		public sacks?: number,
		public collectedDate?: number,
		public samplePack?: SamplePack,
		public warehouse?: Warehouse,
		public collectedBy?: User,
		public withdrawalRequestedBy?: User,
		public movementedResponsible?: User,
		public movementedBy?: User,
		public movementDate?: number,
		public lastModified?: number,
		public movementType?: string,
		public indicationSpecialCoffee?: boolean,
		public sacksInteger?: number,
		public lastClassificationVersionAuthorized?: ClassificationVersion,
    public sampleMovementsHistory?: Array<SampleMovementHistory>
	) {
		if (samplePack) {
			this.samplePack = SamplePack.fromData(samplePack);
		}

		if (warehouse) {
			this.warehouse = Warehouse.fromData(warehouse);
		}

		if (batches) {
			this.batches = Batch.fromListData(batches);
		}

		if (collectedBy) {
			this.collectedBy = User.fromData(collectedBy);
		}

		if (movementedBy) {
			this.movementedBy = User.fromData(movementedBy);
		}

		if (movementedResponsible) {
			this.movementedResponsible = User.fromData(movementedResponsible);
		}

		if (withdrawalRequestedBy) {
			this.withdrawalRequestedBy = User.fromData(withdrawalRequestedBy);
		}

		if (lastClassificationVersionAuthorized) {
			this.lastClassificationVersionAuthorized = ClassificationVersion.fromData(lastClassificationVersionAuthorized);
		}

		if(sampleMovementsHistory) {
		  this.sampleMovementsHistory = SampleMovementHistory.fromListData(sampleMovementsHistory);
    }
	}

	get motiveLabel(): string {
		switch (this.motive) {
			case 'CLASSIFICATION':
				return 'Classificação';
			case 'REINFORCEMENT':
				return 'Reenforço de amostra';
			case 'RECLASSIFICATION':
				return 'Reclassificação';
			default:
				return null;
		}
	}

	get movementTypeLabel(): string {
		switch (this.movementType) {
			case 'CLOSED':
				return 'Dado baixa';
			case 'WITHDRAW':
				return 'Retirada';
			case 'IN':
				return 'Entrada';
			case 'RETURN':
				return 'Devolução';
			default:
				return null;
		}
	}
	get movementDateString(): string {
		return DateTimeHelper.toDDMMYYYYHHmm(this.movementDate);
	}

	set movementDateString(movementDateString: string) {
		this.movementDate = DateTimeHelper.fromDDMMYYYYHHmm(movementDateString);
	}

	get collectedDateString(): string {
		return DateTimeHelper.toDDMMYYYYHHmm(this.collectedDate);
	}

	set collectedDateString(collectedDateString: string) {
		this.collectedDate = DateTimeHelper.fromDDMMYYYYHHmm(collectedDateString);
	}

	get lastModifiedString(): string {
		return DateTimeHelper.toDDMMYYYYHHmm(this.lastModified);
	}

	set lastModifiedString(lastModifiedString: string) {
		this.lastModified = DateTimeHelper.fromDDMMYYYYHHmm(lastModifiedString);
	}

	get batchCodes(): string {
		return this.batches.map(batch => { return batch.batchCode; }).join(", ");
	}

  get batchCreateDates(): string {
    return this.batches.map(batch => { return batch.createdDateString; }).join(", ");
  }

  get batchDays(): string {
    return this.batches.map(batch => { return batch.batchDays; }).join(", ");
  }

  get batchCollaborators(): string {
    return this.batches.map(batch => { return batch.collaborator.code; }).join(", ");
  }

  get totalBatchesQuantityPerSacks(): number {
		if (!this.batches || !this.batches.length) {
			return 0;
		}

		return this.batches.map(batch => batch.balance)
			.reduce((a, b) => Number(a) + Number(b), 0);
	}

	get totalBatchesQuantityPerSacksString(): string {
		return NumberHelper.toPTBR(this.totalBatchesQuantityPerSacks);
	}

	get indicationSpecialCoffeeString() {
		return this.indicationSpecialCoffee ? 'Sim' : 'Não';
	}

	get statusObject() {
		return SampleStatus.fromData(this.status);
	}

	get picoteRequest() {
    let hasItem:boolean = false;
    for (const smh of this.sampleMovementsHistory) {
      if (smh && smh.movementTypeLabel.code == SampleMovementType.PICOTE_REQUEST.code) {
        hasItem = true;
        break;
      }
    }
	  return hasItem;
  }

  get picoteAccepted() {
    let hasItem:boolean = false;
    for (const smh of this.sampleMovementsHistory) {
      if (smh && smh.movementTypeLabel.code == SampleMovementType.PICOTE_ACCEPTED.code) {
        hasItem = true;
        break;
      }
    }
    return hasItem;
  }

  get picoteReadytoship() {
    let hasItem:boolean = false;
    for (const smh of this.sampleMovementsHistory) {
      if (smh && smh.movementTypeLabel.code == SampleMovementType.PICOTE_READYTOSHIP.code) {
        hasItem = true;
        break;
      }
    }
    return hasItem;
  }

  get picoteSent() {
    let hasItem:boolean = false;
    for (const smh of this.sampleMovementsHistory) {
      if (smh && smh.movementTypeLabel.code == SampleMovementType.PICOTE_SENT.code) {
        hasItem = true;
        break;
      }
    }
    return hasItem;
	}

  get picoteReceive() {
	  let hasItem:boolean = false;
    for (const smh of this.sampleMovementsHistory) {
      if (smh && smh.movementTypeLabel.code == SampleMovementType.PICOTE_IN.code) {
        hasItem = true;
        break;
      }
    }

    return hasItem;
  }

  get sampleReceiveForSpecialCoffee() {
    let hasItem:boolean = false;
    for (const smh of this.sampleMovementsHistory) {
      if (smh && smh.movementTypeLabel.code == SampleMovementType.WITHDRAW.code
        && smh.departmentRequestBy && smh.departmentRequestBy.name == "CAFÉ ESPECIAL") {
        hasItem = true;
        break;
      }
    }
    return hasItem;
  }

  get picoteRequestDate() {
    let requestDate:any;
    for (const smh of this.sampleMovementsHistory) {
      if (smh && smh.movementTypeLabel.code == SampleMovementType.PICOTE_REQUEST.code) {
        requestDate = smh.movementDate;
        break;
      }
    }
    return requestDate;
  }

  get picoteRequestMovementedBy() {
    let movementedBy:any;
    for (const smh of this.sampleMovementsHistory) {
      if (smh && smh.movementTypeLabel.code == SampleMovementType.PICOTE_REQUEST.code) {
        movementedBy = smh.movementedBy;
        break;
      }
    }
    return movementedBy;
  }

  get picoteRequestDateString(): string {
    return DateTimeHelper.toDDMMYYYYHHmm(this.picoteRequestDate);
  }

  get picoteStatus() {
    let request:boolean = this.picoteRequest;
    let accepted:boolean = this.picoteAccepted;
    let readytoship:boolean = this.picoteReadytoship;
    let sent:boolean = this.picoteSent;
    let receive:boolean = this.picoteReceive;
    if(request){
      return SampleMovementType.PICOTE_REQUEST.name;
    }else if(accepted){
      return SampleMovementType.PICOTE_ACCEPTED.name;
    }else if(readytoship){
      return SampleMovementType.PICOTE_READYTOSHIP.name;
    }else if(sent){
      return SampleMovementType.PICOTE_SENT.name;
    }else if(receive){
      return SampleMovementType.PICOTE_IN.name;
    }
  }

  get sampleClosed() {
    let hasItem:boolean = false;
    for (const smh of this.sampleMovementsHistory) {
      if (smh && smh.movementTypeLabel.code == SampleMovementType.CLOSED.code) {
        hasItem = true;
        break;
      }
    }
    return hasItem;
  }

  get picoteRequestQuantity() {
    let quantity:any;
    for (const smh of this.sampleMovementsHistory) {
      if (smh && smh.movementTypeLabel.code == SampleMovementType.PICOTE_REQUEST.code) {
        quantity = smh.quantity;
        break;
      }
      if (smh && smh.movementTypeLabel.code == SampleMovementType.PICOTE_ACCEPTED.code) {
        quantity = smh.quantity;
        break;
      }
      if (smh && smh.movementTypeLabel.code == SampleMovementType.PICOTE_READYTOSHIP.code) {
        quantity = smh.quantity;
        break;
      }
      if (smh && smh.movementTypeLabel.code == SampleMovementType.PICOTE_SENT.code) {
        quantity = smh.quantity;
        break;
      }
      if (smh && smh.movementTypeLabel.code == SampleMovementType.PICOTE_IN.code) {
        quantity = smh.quantity;
        break;
      }
    }
    return NumberHelper.toPTBR(quantity);
  }
}
