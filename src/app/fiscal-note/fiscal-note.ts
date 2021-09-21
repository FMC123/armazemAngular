import { Farm } from '../farm/farm';
import { Collaborator } from '../collaborator/collaborator';
import { PurchaseForecast } from '../purchase-forecast/purchase-forecast';
import { BatchOperation } from '../batch-operation/batch-operation';
import { City } from '../city/city';
import { Drink } from '../drink/drink';
import { DateTimeHelper } from '../shared/globalization';
import { NumberHelper } from '../shared/globalization';
import { Strainer } from '../strainer/strainer';
import { Transportation } from '../transportation/transportation';
import { TransportationFiscalNoteCertificate } from '../transportation/transportation-fiscal-note/certificate/transportation-fiscal-note-certificate';
import { WarehouseStakeholder } from '../warehouse-stakeholder/warehouse-stakeholder';
import { FiscalNoteType } from './fiscal-note-type';
import { PurchaseOrder } from 'app/purchase-order/purchase-order';
import { PackType } from 'app/pack-type/pack-type';
import {PackStockMovement} from "../pack-stock/pack-stock-movement";
import {PackStockMovementGroup} from "../pack-stock/pack-stock-movement-group";

export class FiscalNote {
	tempId: string;
	certificates: Array<TransportationFiscalNoteCertificate> = [];
	_selected: boolean;
  packStockMovementGroup: PackStockMovementGroup = new PackStockMovementGroup();

	set selected(value) {
		this._selected = value;
	}

	get selected() {
		if (this.batchOperation && this.batchOperation.id) {
			this._selected = false;
		}

		return this._selected;
	}

	static fromListData(listData: Array<FiscalNote>): Array<FiscalNote> {
		return listData.map(data => {
			return FiscalNote.fromData(data);
		});
	}

	static fromData(data: FiscalNote): FiscalNote {
		if (!data) return new this();
		let fiscalNote = new this(
			data.id,
			data.noteType,
			data.code,
			data.quantity,
			data.unitPrice,
			data.barCode,
			data.strainer,
			data.senderStakeholder,
			data.emissionDate,
			data.senderCity,
			data.ownerStakeholder,
			data.drink,
			data.purchaseCode,
			data.grossWeight,
			data.netWeight,
			data.totalPrice,
			data.baseValueForTax,
			data.taxIcmsPercent,
			data.transportation,
			data.batchOperation,
			data.purchaseForecast,
			data.collaborator,
			data.farm,
			data.purchaseOrder,
			data.packType,
			data.serie
		);
		return fiscalNote;
	}

	constructor(
		public id?: string,
		public noteType?: string,
		public code?: string,
		public quantity?: number,
		public unitPrice?: number,
		public barCode?: string,
		public strainer?: Strainer,
		public senderStakeholder?: WarehouseStakeholder,
		public emissionDate?: number,
		public senderCity?: City,
		public ownerStakeholder?: WarehouseStakeholder,
		public drink?: Drink,
		public purchaseCode?: string,
		public grossWeight?: number,
		public netWeight?: number,
		public totalPrice?: number,
		public baseValueForTax?: number,
		public taxIcmsPercent?: number,
		public transportation?: Transportation,
		public batchOperation?: BatchOperation,
		public purchaseForecast?: PurchaseForecast,
		public collaborator?: Collaborator,
		public farm?: Farm,
		public purchaseOrder?: PurchaseOrder,
		public packType?: PackType,
		public serie?:String,
	) {
		if (transportation) {
			this.transportation = Transportation.fromData(transportation);
		}

		if (batchOperation) {
			this.batchOperation = BatchOperation.fromData(batchOperation);
		}

		if (purchaseForecast) {
			this.purchaseForecast = PurchaseForecast.fromData(purchaseForecast);
		}

		if (collaborator) {
			this.collaborator = Collaborator.fromData(collaborator);
		}

		if (farm) {
			this.farm = Farm.fromData(farm);
		}

		if (purchaseOrder) {
			this.purchaseOrder = PurchaseOrder.fromData(purchaseOrder);
		}

		if (packType) {
			this.packType = PackType.fromData(packType);
		}

		if (senderStakeholder) {
			this.senderStakeholder = WarehouseStakeholder.fromData(senderStakeholder);
		}

		if (ownerStakeholder) {
			this.ownerStakeholder = WarehouseStakeholder.fromData(ownerStakeholder);
			if (collaborator) {
			  this.ownerStakeholder.collaboratorRegistration = collaborator.registration;
      }
		}
	}

	get certificatesWriteable() {
		return !this.batchOperation || !this.batchOperation.id;
	}

	get noteTypeObject(): FiscalNoteType {
		return FiscalNoteType.fromData(this.noteType);
	}

	get unitPriceString() {
		return NumberHelper.toPTBR(this.unitPrice);
	}

	set unitPriceString(value) {
		this.unitPrice = NumberHelper.fromPTBR(value);
	}

	get grossWeightString() {
		return NumberHelper.toPTBR(this.grossWeight);
	}

	set grossWeightString(value) {
		this.grossWeight = NumberHelper.fromPTBR(value);
	}

	get netWeightString() {
		return NumberHelper.toPTBR(this.netWeight);
	}

	set netWeightString(value) {
		this.netWeight = NumberHelper.fromPTBR(value);
	}

	get totalPriceString() {
		return NumberHelper.toPTBR(this.totalPrice);
	}

	set totalPriceString(value) {
		this.totalPrice = NumberHelper.fromPTBR(value);
	}

	get baseValueForTaxString() {
		return NumberHelper.toPTBR(this.baseValueForTax);
	}

	set baseValueForTaxString(value) {
		this.baseValueForTax = NumberHelper.fromPTBR(value);
	}

	get taxIcmsPercentString() {
		return NumberHelper.toPTBR(this.taxIcmsPercent);
	}

	set taxIcmsPercentString(value) {
		this.taxIcmsPercent = NumberHelper.fromPTBR(value);
	}

	get emissionDateString() {
		if (!this.emissionDate) {
			return null;
		}

		return DateTimeHelper.toDDMMYYYY(this.emissionDate);
	}

	set emissionDateString(value) {
		this.emissionDate = DateTimeHelper.fromDDMMYYYY(value);
	}

	get ceritificateNames(): string{
	  return this.certificates.map(c => c.certificate.name).join(', ');
  }
}
