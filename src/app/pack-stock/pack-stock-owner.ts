import { WarehouseStakeholder } from '../warehouse-stakeholder/warehouse-stakeholder';
import { PackType } from '../pack-type/pack-type';
import { NumberHelper } from '../shared/globalization';

export class PackStockOwner {

  tempId: string;

  static fromListData(listData: Array<PackStockOwner>): Array<PackStockOwner> {
    return listData.map((data) => {
      return PackStockOwner.fromData(data);
    });
  }

  static fromData(data?: PackStockOwner): PackStockOwner {
    if (!data) {
      return new this();
    }

    let packStockOwner = new this(
      data.owner,
      data.packType,
      data.quantity,
    );

    return packStockOwner;
  }

  constructor(
    public owner?: WarehouseStakeholder,
    public packType?: PackType,
    public quantity?: number,
  ) {
    if (owner) {
      this.owner = WarehouseStakeholder.fromData(owner);
    }

    if (packType) {
      this.packType = PackType.fromData(packType);
    }
  }

  get label() {
    if (!this.owner) {
      return null;
    }

    return `${this.owner.person.name} - ${this.quantity}`;
  }

}
