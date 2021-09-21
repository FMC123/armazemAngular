import { BatchOperation } from 'app/batch-operation/batch-operation';
import { PackType } from 'app/pack-type/pack-type';
import { ShippingDataPackType } from "app/shipping-data/pack-type/shipping-data-pack-type";

export class ShippingData {

  static fromListData(listData: Array<ShippingData>): Array<ShippingData> {
    return listData.map((data) => {
      return ShippingData.fromData(data);
    });
  }

  static fromData(data: ShippingData): ShippingData {
    if (!data) {
      return new this();
    }

    let ShippingData = new this(
      data.id,
      data.batchOperation,
      data.destiny,
      data.observation,
      data.oicCode,
      data.containerNumber,
      data.saleReference,
      data.packType,
      data.packTypes,
    );

    return ShippingData;
  }

  constructor(
    public id?: string,
    public batchOperation?: BatchOperation,
    public destiny?: string,
    public observation?: string,
    public oicCode?: string,
    public containerNumber?: string,
    public saleReference?: string,
    public packType?: PackType,
    public packTypes?: Array<ShippingDataPackType>,
  ) {
    if (batchOperation) {
      this.batchOperation = BatchOperation.fromData(batchOperation);
    }

    if (packType) {
      this.packType = PackType.fromData(packType);
    }
  }
}
