import { IndustrialType } from './industrial-type/industrial-type';
import { NumberHelper } from "../shared/globalization";
import { ServiceItemUsageType } from './service-item-usage-type';

export class ServiceItem {

  static fromListData(listData: Array<ServiceItem>): Array<ServiceItem> {
    return listData.map((data) => {
      return ServiceItem.fromData(data);
    });
  }

  static fromData(data: ServiceItem): ServiceItem {
    if (!data) return new this();
    let item = new this(
      data.id,
      data.code,
      data.description,
      data.indQuoteVal,
      data.indIss,
      data.indDiscount,
      data.industrialType,
      data.batchMask,
      data.basePrice,
      data.usage,
      data.groupedCharge
    );
    return item;
  }

  constructor(public id?: string,
    public code?: number,
    public description?: String,
    public indQuoteVal?: Boolean,
    public indIss?: Boolean,
    public indDiscount?: Boolean,
    public industrialType?: String,
    public batchMask?: String,
    public basePrice?: number,
    public usage?: string,
    public groupedCharge?: number
  ) { }

  get indIssString() {
    if (this.indIss) {
      return 'Sim';
    } else {
      return 'Não';
    }
  }

  get indQuoteValString() {
    if (this.indQuoteVal) {
      return 'Sim';
    } else {
      return 'Não';
    }
  }

  get indDiscountString() {
    if (this.indDiscount) {
      return 'Sim';
    } else {
      return 'Não';
    }
  }

  get industrialTypeCode() {
    if (this.industrialType === IndustrialType.N.code) {
      return IndustrialType.N.code;
    } else if (this.industrialType === IndustrialType.L.code) {
      return IndustrialType.L.code;
    } else if (this.industrialType === IndustrialType.R.code) {
      return IndustrialType.R.code;
    }
  }

  get industrialTypeName() {
    if (this.industrialType === IndustrialType.N.code) {
      return IndustrialType.N.name;
    } else if (this.industrialType === IndustrialType.L.code) {
      return IndustrialType.L.name;
    } else if (this.industrialType === IndustrialType.R.code) {
      return IndustrialType.R.name;
    }
  }

  get basePriceString(): string {
    return NumberHelper.toPTBR5Places(this.basePrice);
  }

  set basePriceString(basePrice: string) {
    this.basePrice = NumberHelper.fromPTBR(basePrice);
  }

  /**
   * Label para autocomplete
   */
  get label() {
    return this.code + ' - ' + this.description;
  }

  get usageObject() {
    return ServiceItemUsageType.fromData(this.usage);
  }
}
