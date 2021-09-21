import { ServiceGroupItem } from '../service-group-items/service-group-item';
import { User } from '../user/user';
import { ServiceGroup } from '../service-group/service-group';
import { ServiceItem } from '../service-item/service-item';
import { DateTimeHelper, NumberHelper } from '../shared/globalization';

export class ServiceGroupItemPrice {

  static fromListData(listData: Array<ServiceGroupItemPrice>): Array<ServiceGroupItemPrice>{
    return listData.map((data) => {
      return ServiceGroupItemPrice.fromData(data);
    });
  }

  static fromData(data: ServiceGroupItemPrice): ServiceGroupItemPrice {
    if (!data) return new this();
    let serviceGroupItemPrice = new this(
      data.id,
      data.serviceGroupItem,
      data.initialRange,
      data.finalRange,
      data.price
    );
    return serviceGroupItemPrice;
  }

  constructor(public id?: string,
              public serviceGroupItem?: ServiceGroupItem,
              public initialRange?: number,
              public finalRange?: number,
              public price?: number) {
  }
  get priceString(): string{
    return NumberHelper.toPTBR5Places(this.price);
  }

  set priceString(priceString: string){
    this.price = NumberHelper.fromPTBR(priceString);
  }

  get initialRangeString() {
    if (!this.initialRange) {
      return null;
    }

    return DateTimeHelper.toDDMMYYYY(this.initialRange);
  }

  set initialRangeString(value) {
    this.initialRange = DateTimeHelper.fromDDMMYYYY(value);
  }

  get finalRangeString() {
    if (!this.finalRange) {
      return null;
    }

    return DateTimeHelper.toDDMMYYYY(this.finalRange);
  }

  set finalRangeString(value) {
    this.finalRange = DateTimeHelper.fromDDMMYYYY(value, true);
  }

}
