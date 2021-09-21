import { DateTimeHelper } from '../shared/globalization';
import { NumberHelper } from '../shared/globalization';
import { Drink } from '../drink/drink';
import { City } from '../city/city';
import { WarehouseStakeholder } from '../warehouse-stakeholder/warehouse-stakeholder';
import { Strainer } from '../strainer/strainer';
import { PackType } from '../pack-type/pack-type';
import { Carrier } from '../carrier/carrier';
import { Collaborator } from '../collaborator/collaborator';
import { Farm } from '../farm/farm';
import { PurchaseForecastCertificate } from './purchase-forecast-certificate';
import {Warehouse} from "../warehouse/warehouse";

export class PurchaseForecast {
	static fromListData(
		listData: Array<PurchaseForecast>
	): Array<PurchaseForecast> {
		return listData.map(data => {
			return PurchaseForecast.fromData(data);
		});
	}

	static fromData(data: any): PurchaseForecast {
		if (!data) return new this();
		let purchaseForecast = new this(
			data.id,
			data.purchaseCode,
			data.carrier,
			data.vehiclePlate1,
			data.vehiclePlate2,
			data.packType,
			data.driverName,
			data.originWeight,
			data.fiscalNoteCode,
			data.quantity,
			data.unitPrice,
			data.strainer,
			data.senderStakeholder,
			data.emissionDate,
			data.senderCity,
			data.ownerStakeholder,
			data.drink,
			data.grossWeight,
			data.netWeight,
			data.totalPrice,
			data.baseValueForTax,
			data.taxIcmsPercent,
			data.forecastDate,
			data.unitType,
			data.barCode,
			data.indLinked,
			data.collaborator,
			data.farm,
			data.type,
			data.status,
			data.certificates,
      data.warehouse
		);
		return purchaseForecast;
	}

	constructor(
		public id?: string,
		public purchaseCode?: string,
		public carrier?: Carrier,
		public vehiclePlate1?: string,
		public vehiclePlate2?: string,
		public packType?: PackType,
		public driverName?: string,
		public originWeight?: number,
		public fiscalNoteCode?: string,
		public quantity?: number,
		public unitPrice?: number,
		public strainer?: Strainer,
		public senderStakeholder?: WarehouseStakeholder,
		public emissionDate?: number,
		public senderCity?: City,
		public ownerStakeholder?: WarehouseStakeholder,
		public drink?: Drink,
		public grossWeight?: number,
		public netWeight?: number,
		public totalPrice?: number,
		public baseValueForTax?: number,
		public taxIcmsPercent?: number,
		public forecastDate?: number,
		public unitType?: string,
		public barCode?: string,
		public indLinked?: boolean,
		public collaborator?: Collaborator,
		public farm?: Farm,
		public type?: string,
		public status?: string,
		public certificates?: Array<PurchaseForecastCertificate>,
    public warehouse?: Warehouse
	) {
		if (carrier) {
			this.carrier = Carrier.fromData(carrier);
		}

		if (packType) {
			this.packType = PackType.fromData(packType);
		}

		if (strainer) {
			this.strainer = Strainer.fromData(strainer);
		}

		if (senderStakeholder) {
			this.senderStakeholder = WarehouseStakeholder.fromData(senderStakeholder);
		}

		if (senderCity) {
			this.senderCity = City.fromData(senderCity);
		}

		if (collaborator) {
			this.collaborator = Collaborator.fromData(collaborator);
		}

		if (farm) {
			this.farm = Farm.fromData(farm);
		}

		if (ownerStakeholder) {
			this.ownerStakeholder = WarehouseStakeholder.fromData(ownerStakeholder);
		}

		if (drink) {
			this.drink = Drink.fromData(drink);
		}

		if (certificates) {
			this.certificates = PurchaseForecastCertificate.fromListData(certificates);
		}

		if (warehouse) {
		  this.warehouse = Warehouse.fromData(warehouse);
    }
	}

	get emissionDateString(): string {
		return DateTimeHelper.toDDMMYYYYHHmm(this.emissionDate);
	}

	set emissionDateString(emissionDateString: string) {
		this.emissionDate = DateTimeHelper.fromDDMMYYYYHHmm(emissionDateString);
	}

	get forecastDateString(): string {
		return DateTimeHelper.toDDMMYYYYHHmm(this.forecastDate);
	}

	set forecastDateString(forecastDateString: string) {
		this.forecastDate = DateTimeHelper.fromDDMMYYYYHHmm(forecastDateString);
	}

	get originWeightString(): string {
		return NumberHelper.toPTBR(this.originWeight);
	}

	set originWeightString(originWeightString: string) {
		this.originWeight = NumberHelper.fromPTBR(originWeightString);
	}

	get netWeightString(): string {
		return NumberHelper.toPTBR(this.netWeight);
	}

	set netWeightString(netWeightString: string) {
		this.netWeight = NumberHelper.fromPTBR(netWeightString);
	}

	get grossWeightString(): string {
		return NumberHelper.toPTBR(this.grossWeight);
	}

	set grossWeightString(grossWeightString: string) {
		this.grossWeight = NumberHelper.fromPTBR(grossWeightString);
	}

	get unitPriceString(): string {
		return NumberHelper.toPTBR(this.unitPrice);
	}

	set unitPriceString(unitPriceString: string) {
		this.originWeight = NumberHelper.fromPTBR(unitPriceString);
	}

	get typeLabel(): string {
		switch (this.type) {
			case 'TRANSPORTE_DO_CAFE':
				return 'Transporte do Café';
			case 'ENTREGA_FUTURA':
				return 'Entrega futura';
			case 'CAFE_DE_VARREDURA':
				return 'Café de varredura';
			case 'CAFE_DE_TERCEIROS':
				return 'Café de terceiros';
			default:
				return null;
		}
	}

	get statusLabel(): string {
		switch (this.status) {
			case 'LINKED_IN':
				return 'Vinculado';
			case 'CANCELED':
				return 'Cancelado';
			case 'OPEN':
				return 'Em aberto';
			default:
				return null;
		}
	}
}
