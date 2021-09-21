import { DateTimeHelper, NumberHelper } from '../../shared/globalization';
import { MarkupGroupBatch } from '../../markup-group/batch/markup-group-batch';
import { StorageUnit } from '../storage-unit';

export class StorageUnitOut {
  static fromListData(listData: Array<StorageUnitOut>): Array<StorageUnitOut> {
    return listData.map((data) => {
      return StorageUnitOut.fromData(data);
    });
  }

  static fromData(data: StorageUnitOut): StorageUnitOut {
    if (!data) {
      return new this();
    }

    let storageUnit = new this(
      data.id,
      data.storageUnit,
      data.markupGroupBatch,
      data.quantity,
      data.createdDate,
      data.sellCode,
    );

    return storageUnit;
  }

  constructor(
    public id?: string,
    public storageUnit?: StorageUnit,
    public markupGroupBatch?: MarkupGroupBatch,
    public quantity?: number,
    public createdDate?: number,
    public sellCode?: string
  ) {
    if (storageUnit) {
      this.storageUnit = StorageUnit.fromData(storageUnit);
    }

    if (markupGroupBatch) {
      this.markupGroupBatch = MarkupGroupBatch.fromData(markupGroupBatch);
    }
  }

  get quantityString(): string{
    return NumberHelper.toPTBR(this.quantity);
  }

  set quantityString(quantityString: string){
    this.quantity = NumberHelper.fromPTBR(quantityString);
  }

  get createdDateString(): string{
    return DateTimeHelper.toDDMMYYYYHHmm(this.createdDate);
  }

  set createdDateString(createdDateString: string){
    this.createdDate = DateTimeHelper.fromDDMMYYYYHHmm(createdDateString);
  }

}
