import {PackType} from "app/pack-type/pack-type";
import {ShippingData} from "app/shipping-data/shipping-data";

export class ShippingDataPackType {

  static fromListData(listData: Array<ShippingDataPackType>): Array<ShippingDataPackType> {
    return listData.map((data) => {
      return ShippingDataPackType.fromData(data);
    });
  }

  static fromData(data: ShippingDataPackType): ShippingDataPackType {
    if (!data) {
      return new this();
    }

    let shippingDataPackType = new this(
      data.id,
      data.quantity,
      data.weightAddition,
      data.packType,
      data.shippingData,
    );

    return shippingDataPackType;
  }

  constructor(
    public id?: string,
    public quantity?: number,
    public weightAddition?: boolean,
    public packType?: PackType,
    public shippingData?: ShippingData,
  ){
    if (shippingData) {
      this.shippingData = ShippingData.fromData(shippingData);
    }

    if (packType) {
      this.packType = PackType.fromData(packType);
    }
  }

}
