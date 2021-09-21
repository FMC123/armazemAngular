import { Batch } from '../batch/batch';
import { NumberHelper } from '../shared/globalization';
import { StorageUnit } from './storage-unit';

export class StorageUnitBatch {

  static fromListData(listData: Array<StorageUnitBatch>): Array<StorageUnitBatch> {
    return listData.map((data) => {
      return StorageUnitBatch.fromData(data);
    });
  }

  static fromData(data: StorageUnitBatch): StorageUnitBatch {
    if (!data) return new this();

    let storageUnitBatch = new this(
      data.id,
      data.storageUnit,
      data.batch,
      data.quantity,
      data.unitType,
      data.deletedDate,
      data.quantityRef
    );

    return storageUnitBatch;
  }

  constructor(
    public id?: string,
    public storageUnit?: StorageUnit,
    public batch?: Batch,
    public quantity?: number,
    public unitType?: string,
    public deletedDate?: number,
    public quantityRef?: number
  ) {
    if (batch) {
      this.batch = Batch.fromData(batch);
    }

    if (storageUnit) {
      this.storageUnit = StorageUnit.fromData(storageUnit);
    }
  }

  get quantityString(): string{
    return NumberHelper.toPTBR(this.quantity);
  }

  set quantityString(value: string){
    this.quantity = NumberHelper.fromPTBR(value);
  }

  get quantityRefString(): string{
    return NumberHelper.toPTBR(this.quantityRef);
  }

  set quantityRefString(value: string){
    this.quantityRef = NumberHelper.fromPTBR(value);
  }
}
