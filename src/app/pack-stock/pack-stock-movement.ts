import { PackStockMovementGroup } from './pack-stock-movement-group';
import { PackType } from '../pack-type/pack-type';
import { NumberHelper } from '../shared/globalization';

export class PackStockMovement {

  tempId: string;

  static fromListData(listData: Array<PackStockMovement>): Array<PackStockMovement> {
    return listData.map((data) => {
      return PackStockMovement.fromData(data);
    });
  }

  static fromData(data?: PackStockMovement): PackStockMovement {
    if (!data) {
      return new this();
    }

    let packStockMovement = new this(
      data.id,
      data.packType,
      data.quantityVariation,
      data.unitValue,
      data.packStockMovementGroup,
    );

    return packStockMovement;
  }

  constructor(
    public id?: string,
    public packType?: PackType,
    public quantityVariation?: number,
    public unitValue?: number,
    public packStockMovementGroup?: PackStockMovementGroup,
  ) {
    if (packStockMovementGroup) {
      this.packStockMovementGroup = PackStockMovementGroup.fromData(packStockMovementGroup);
    }
  }

  get unitValueString() {
    return NumberHelper.toPTBR(this.unitValue);
  }

  set unitValueString(value) {
    this.unitValue = NumberHelper.fromPTBR(value);
  }

  get totalWeight() {
    if (this.packType && this.packType.weight && this.quantityVariation) {
      let quantityVariationAbs = Math.abs(this.quantityVariation);
      return quantityVariationAbs * this.packType.weight;
    }

    return 0;
  }

  get totalValue() {
    if (this.unitValue && this.quantityVariation) {
      return this.unitValue * this.quantityVariation;
    }

    return 0;
  }

  get totalWeightString() {
    return NumberHelper.toPTBR(this.totalWeight);
  }

  get totalValueString() {
    return NumberHelper.toPTBR(this.totalValue);
  }

}
