import { Batch } from '../batch/batch';
import { StorageUnitLog } from '../storage-unit-batch-log/storage-unit-log';
import { NumberHelper } from '../shared/globalization';
import { StorageUnitOut } from '../storage-unit/out/storage-unit-out';
import { User } from 'app/user/user';
import { Forklift } from 'app/forklift/forklift';

export class StorageUnitBatchLog {

  static fromListData(listData: Array<StorageUnitBatchLog>): Array<StorageUnitBatchLog> {
    return listData.map((data) => {
      return StorageUnitBatchLog.fromData(data);
    });
  }

  static fromData(data: StorageUnitBatchLog): StorageUnitBatchLog {
    if (!data) {
      return new this();
    }

    let storageUnitBatchLog = new this(
      data.id,
      data.storageUnitLog,
      data.storageUnitLocation,
      data.batch,
      data.quantity,
      data.unitType,
      data.sellCode,
      data.lastModifiedBy,
      data.forklift,
      data.storageUnitOut
    );

    return storageUnitBatchLog;
  }

  constructor(
    public id?: string,
    public storageUnitLog?: StorageUnitLog,
    public storageUnitLocation?: StorageUnitLog,
    public batch?: Batch,
    public quantity?: number,
    public unitType?: string,
    public sellCode?: string,
    public lastModifiedBy?: User,
    public forklift?: Forklift,
    public storageUnitOut?: StorageUnitOut
  ) {
    if (batch) {
      this.batch = Batch.fromData(batch);
    }

    if (storageUnitLog) {
      this.storageUnitLog = StorageUnitLog.fromData(storageUnitLog);
    }

    if (storageUnitLocation) {
      this.storageUnitLocation = StorageUnitLog.fromData(storageUnitLocation);
    }

    if (lastModifiedBy) {
      this.lastModifiedBy = User.fromData(lastModifiedBy);
    }

    if (forklift) {
      this.forklift = Forklift.fromData(forklift);
    }

    if (storageUnitOut) {
      this.storageUnitOut = StorageUnitOut.fromData(storageUnitOut);
    }
  }

  get quantityString(): string{
    return NumberHelper.toPTBR(this.quantity);
  }

  set quantityString(value: string){
    this.quantity = NumberHelper.fromPTBR(value);
  }

}
