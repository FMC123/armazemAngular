import { NumberHelper } from '../../shared/globalization/number-helper';
import { StorageUnitBatch } from '../../storage-unit/storage-unit-batch';
import { MarkupGroup } from '../markup-group';

export class MarkupGroupStorageUnit {

  static fromListData(listData: Array<MarkupGroupStorageUnit>): Array<MarkupGroupStorageUnit> {
    return listData.map((data) => {
      return MarkupGroupStorageUnit.fromData(data);
    });
  }

  static fromData(data: any): MarkupGroupStorageUnit {
    if (!data) return new this();
    let markupGroup = new this(
      data.id,
      data.storageUnitBatch,
      data.markupGroup,
      data.quantity,
    );
    return markupGroup;
  }

  constructor(
    public id?: string,
    public storageUnitBatch?: StorageUnitBatch,
    public markupGroup?: MarkupGroup,
    public quantity?: number,
  ) {
    if (storageUnitBatch) {
      this.storageUnitBatch = StorageUnitBatch.fromData(storageUnitBatch);
    }

    if (markupGroup) {
      this.markupGroup = MarkupGroup.fromData(markupGroup);
    }
  }

  get quantityString(): string {
    return NumberHelper.toPTBR(this.quantity);
  }

  set quantityString(value) {
    this.quantity = NumberHelper.fromPTBR(value);
  }

}
