import { Scale } from '../scale/scale';
import { BatchOperation } from '../batch-operation/batch-operation';
import { Carrier } from '../carrier/carrier';
import { FiscalNote } from '../fiscal-note/fiscal-note';
import { PackType } from '../pack-type/pack-type';
import { DateTimeHelper } from '../shared/globalization';
import { NumberHelper } from '../shared/globalization';
import { User } from '../user/user';
import { TransportationStatus } from './transportation-status';
import { TransportationType } from './transportation-type';
import { Batch } from '../batch/batch';
import {ProductTransportationType} from "./product-transportation-type";
import {Driver} from "../driver/driver";

export class Transportation {
	opened = false;

	purchaseForecastFiscalNote: FiscalNote;

	static fromListData(listData: Array<Transportation>): Array<Transportation> {
		return listData.map(data => {
			return Transportation.fromData(data);
		});
	}

	static fromData(data: any): Transportation {
		if (!data) return new this();
		let transportation = new this(
			data.id,
			data.deletedDate,
			data.arriveDate,
			data.type,
			data.status,
			data.carrier,
			data.vehiclePlate1,
			data.vehiclePlate2,
			data.vehiclePlate3,
			data.driverName,
			data.driver,
			data.originWeight,
			data.tareWeight,
			data.grossWeight,
			data.auditorUser,
			data.batchOperationOut,
			data.fiscalNotesOrSellCode,
			data.fiscalNotes,
			data.batches,
      data.productType,
      data.netWeight,
      data.batchOperationCode,
      data.maxWeight,
      data.maxSacks,
		);
		return transportation;
	}

	constructor(
		public id?: string,
		public deletedDate?: number,
		public arriveDate?: number,
		public type?: string,
		public status?: string,
		public carrier?: Carrier,
		public vehiclePlate1?: string,
		public vehiclePlate2?: string,
		public vehiclePlate3?: string,
		public driverName?: string,
		public driver?: Driver,
		public originWeight?: number,
		public tareWeight?: number,
		public grossWeight?: number,
		public auditorUser?: User,
		public batchOperationOut?: BatchOperation,
		public fiscalNotesOrSellCode?: string,
		public fiscalNotes?: FiscalNote[],
		public batches?: Batch[],
    public productType?: string,
    public netWeight?: number,
    public batchOperationCode?: string,
    public maxWeight?: number,
    public maxSacks?: number,
	) {
		if (carrier) {
			this.carrier = Carrier.fromData(carrier);
		}

    if (driver) {
      this.driver = Driver.fromData(driver);
    }

		if (auditorUser) {
			this.auditorUser = User.fromData(auditorUser);
		}

		if (batchOperationOut) {
			this.batchOperationOut = BatchOperation.fromData(batchOperationOut);
		}

		if (fiscalNotes) {
			this.fiscalNotes = FiscalNote.fromListData(fiscalNotes);
		} else {
			this.fiscalNotes = [];
		}

		if (batches) {
			this.batches = Batch.fromListData(batches);
		} else {
			this.batches = [];
		}
	}

	get allowWeighing() {
		return (
			this.status &&
			[
				TransportationStatus.AUTORIZACAO_EFETUADA.code,
				TransportationStatus.PROCESSO_CARGA_DESCARGA.code
			].includes(this.status)
		);
	}

	get allowCancelRelease() {
		return (
			this.status &&
			this.status === TransportationStatus.LIBERACAO_PERMITIDA.code
		);
	}

	get allowClose() {
		return (
			this.status &&
			this.status === TransportationStatus.LIBERACAO_PERMITIDA.code
		);
	}

	get allowReopen() {
		return (
			this.status &&
			this.status === TransportationStatus.FECHADO.code
		);
	}

	get allowRelease() {
		return (
			this.status &&
			this.status === TransportationStatus.AGUARDANDO_LIBERACAO.code
		);
	}

	get allowEnter() {
		if (this.type === TransportationType.IN.code) {
			return (
				this.status &&
				this.status === TransportationStatus.AGUARDANDO_ENTRADA.code
			);
		} else if (this.type === TransportationType.OUT.code) {
			return (
				!!this.status &&
				this.status === TransportationStatus.AGUARDANDO_ENTRADA.code/* &&
				!!this.batchOperationOut &&
				!!this.batchOperationOut.shippingAuthorization*/
			);
		} else {
			return false;
		}
	}

	get allowCancelEnter() {
		return (
      this.status &&
      this.status === TransportationStatus.AUTORIZACAO_EFETUADA.code ||
      ( this.status === TransportationStatus.PROCESSO_CARGA_DESCARGA.code && this.type === 'OUT' )
		);
	}

	get allowEdit() {
		return (
			this.status &&
			this.status === TransportationStatus.AGUARDANDO_ENTRADA.code
		);
	}

	get allowDelete() {
    return (
      this.status &&
      this.status === TransportationStatus.AGUARDANDO_ENTRADA.code
    );
  }

	get arriveDateString() {
		return DateTimeHelper.toDDMMYYYYHHmm(this.arriveDate);
	}

	get typeObject(): TransportationType {
		return TransportationType.fromData(this.type);
	}

	get statusObject(): TransportationStatus {
		return TransportationStatus.fromData(this.status);
	}

	get originWeightString(): string {
		return NumberHelper.toPTBR(this.originWeight);
	}

	set originWeightString(originWeightString: string) {
		this.originWeight = NumberHelper.fromPTBR(originWeightString);
	}

	get tareWeightString(): string {
		return NumberHelper.toPTBR(this.tareWeight);
	}

	set tareWeightString(tareWeightString: string) {
		this.tareWeight = NumberHelper.fromPTBR(tareWeightString);
	}

	get grossWeightString(): string {
		return NumberHelper.toPTBR(this.grossWeight);
	}

	set grossWeightString(grossWeightString: string) {
		this.grossWeight = NumberHelper.fromPTBR(grossWeightString);
	}

	get shippingAuthorization() {
		if (!this.batchOperationOut) {
			return null;
		}

		if (!this.batchOperationOut.shippingAuthorization) {
			return null;
		}

		if (!this.batchOperationOut.shippingAuthorization.id) {
			return null;
		}

		return this.batchOperationOut.shippingAuthorization;
	}

	get plates() {

		let list = [];

		if (this.vehiclePlate1) {
			list.push(this.vehiclePlate1);
		}

		if (this.vehiclePlate2) {
			list.push(this.vehiclePlate2);
		}

		if (this.vehiclePlate3) {
			list.push(this.vehiclePlate3);
		}

		return list.join(', ').toUpperCase();
	}
  get netWeightString(): string {
    if (!this.tareWeight) {
      return '-';
    }

    if (!this.grossWeight) {
      return '-';
    }

    return NumberHelper.toPTBR(this.netWeight);
  }

  isPacking(){
	  return this.productType == ProductTransportationType.PACKING.code;
  }

  get allowDocumentEntryReport(): boolean {
    return (this.type === TransportationType.IN.code
        && (this.status == TransportationStatus.AGUARDANDO_LIBERACAO.code
           || this.status == TransportationStatus.LIBERACAO_PERMITIDA.code
           || this.status == TransportationStatus.FECHADO.code)
        && this.isPacking());
  }

  get allowDocumentExitReport(): boolean {
    return (this.type === TransportationType.OUT.code
        && (this.status == TransportationStatus.AGUARDANDO_LIBERACAO.code
          || this.status == TransportationStatus.LIBERACAO_PERMITIDA.code
          || this.status == TransportationStatus.FECHADO.code)
        && this.isPacking());
  }

  get maxWeightLimit(): number {
	  if(!this.maxWeight || !this.maxSacks ){
	    return 0;
    }
    return this.maxWeight * this.maxSacks;
  }
}
