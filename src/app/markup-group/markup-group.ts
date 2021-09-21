import { Warehouse } from '../warehouse/warehouse';
import { MarkupGroupStorageUnit } from './storage-unit/markup-group-storage-unit';
import { MarkupGroupBatch } from './batch/markup-group-batch';
import { MarkupGroupType } from './markup-group-type';
import { MarkupGroupSample } from "./sample/markup-group-sample";
import { BatchOperation } from 'app/batch-operation/batch-operation';
import { NumberHelper } from 'app/shared/globalization';

export class MarkupGroup {
  static fromListData(listData: Array<MarkupGroup>): Array<MarkupGroup> {
    return listData.map((data) => {
      return MarkupGroup.fromData(data);
    });
  }

  static fromData(data: any): MarkupGroup {
    if (!data) return new this();
    let markupGroup = new this(
      data.id,
      data.label,
      data.color,
      data.type,
      data.batches,
      data.storageUnits,
      data.samples,
      data.warehouse,
      data.createdDate,
      data.lastModified,
      data.deletedDate,
      data.selected,
      data.excludedFromMapAt,
      data.markedStorageUnits,
      data.markedBatches,
      data.markedPositionsStacks,
      data.batchOperation,
      data.totalDump
    );
    return markupGroup;
  }

  constructor(
    public id?: string,
    public label?: string,
    public color?: string,
    public type?: string,
    public batches?: Array<MarkupGroupBatch>,
    public storageUnits?: Array<MarkupGroupStorageUnit>,
    public samples?: Array<MarkupGroupSample>,
    public warehouse?: Warehouse,
    public createdDate?: number,
    public lastModified?: number,
    public deletedDate?: number,
    public selected?: boolean,
    public excludedFromMapAt?: number,
    public markedStorageUnits?: Array<string>,
    public markedBatches?: Array<string>,
    public markedPositionsStacks?: Array<string>,
    public batchOperation?: BatchOperation,
    public totalDump?: number
  ) {
    if (batches) {
      this.batches = MarkupGroupBatch.fromListData(batches);

      this.batches.sort((a, b) => {
        if (!a.batch || !a.batch.batchCode) {
          return -1;
        }

        if (!b.batch || !b.batch.batchCode) {
          return 1;
        }

        return a.batch.batchCode.localeCompare(b.batch.batchCode);
      });

    } else {
      this.batches = [];
    }

    if (storageUnits) {
      this.storageUnits = MarkupGroupStorageUnit.fromListData(storageUnits);
    } else {
      this.storageUnits = [];
    }

    if (samples) {
      this.samples = MarkupGroupSample.fromListData(samples);
    } else {
      this.samples = [];
    }

    if (warehouse) {
      this.warehouse = Warehouse.fromData(warehouse);
    }

    if (!type) {
      this.type = MarkupGroupType.GENERIC.code;
    }

    if (batchOperation) {
      this.batchOperation = BatchOperation.fromData(batchOperation);
    }
  }

  get typeObject(): MarkupGroupType {
    return MarkupGroupType.fromData(this.type);
  }

  set typeObject(value: MarkupGroupType) {
    if (value) {
      this.type = value.code;
    } else {
      this.type = null;
    }
  }

  get allowAssociateStorageUnits() {
    return MarkupGroupType.GENERIC.code === this.type;
  }

  get allowDelete() {
    return MarkupGroupType.GENERIC.code === this.type;
  }

  get orderPriority() {
    if (this.type === MarkupGroupType.BATCH_OPERATION.code) {
      return 1;
    }

    if (this.type === MarkupGroupType.GENERIC.code) {
      let priority = this.createdDate;

      if (!priority) {
        return 0;
      }

      while (priority >= 1) {
        priority = priority / 10;
      }

      return priority;
    }

    if (this.type === MarkupGroupType.SHIPPING_AUTHORIZATION.code) {
      return -1;
    }
  }

  /**
   * Lista nomes dos donos dos lotes (sem repetir)
   */
  get ownersBatchesNames() {

    let names = [];

    if (this.batches != null && this.batches.length > 0) {

      this.batches.forEach(mgb => {

        if (mgb.batch != null && mgb.batch.batchOperation != null && mgb.batch.batchOperation.owner != null
          && mgb.batch.batchOperation.owner.person != null && mgb.batch.batchOperation.owner.person.name != null) {

          // se já existir não insere
          if (names.indexOf(mgb.batch.batchOperation.owner.person.name) == -1) {
            names.push(mgb.batch.batchOperation.owner.person.name);
          }
        }
      });

      // ordena pelos nomes
      names.sort();
    }

    return names.join(', ');
  }

  get ownersBatchesNamesWithDocuments() {

    let names = [];

    if (this.batches != null && this.batches.length > 0) {

      this.batches.forEach(mgb => {

        if (mgb.batch != null && mgb.batch.batchOperation != null && mgb.batch.batchOperation.owner != null
          && mgb.batch.batchOperation.owner.person != null && mgb.batch.batchOperation.owner.person.name != null) {

          // se já existir não insere
          if (names.indexOf(mgb.batch.batchOperation.owner.label) == -1) {
            names.push(mgb.batch.batchOperation.owner.label);
          }
        }
      });

      // ordena pelos nomes
      names.sort();
    }

    return names.join(', ');
  }

  /**
   * Quantidade total de peso
   */
  getTotalWeight() {

    let total: number = 0;

    if (this.batches != null && this.batches.length > 0) {

      this.batches.forEach(mgb => {
        total = total + mgb.quantity;
      });
    }

    return NumberHelper.toPTBR(total);
  }
  getTotalWeightNumber() {

    let total: number = 0;

    if (this.batches != null && this.batches.length > 0) {

      this.batches.forEach(mgb => {
        total = total + mgb.quantity;
      });
    }

    return total;
  }

  getCurrentWeight() {

    let total: number = 0;

    if (this.batches != null && this.batches.length > 0) {

      this.batches.forEach(mgb => {
        total = total + mgb.currentQuantity;
      });
    }

    return NumberHelper.toPTBR(total);
  }

  getCurrentWeightNumber() {

    let total: number = 0;

    if (this.batches != null && this.batches.length > 0) {

      this.batches.forEach(mgb => {
        total = total + mgb.currentQuantity;
      });
    }

    return total;
  }

  getTotalLeft() {

    let total: number = 0;

    if (this.batches != null && this.batches.length > 0) {

      this.batches.forEach(mgb => {
        total = total + mgb.leftQuantity;
      });
    }

    return NumberHelper.toPTBR(total);
  }

  /**
   * Quantidade total de sacas
   */
  getTotalSacks() {

    let total: number = 0;

    if (this.batches != null && this.batches.length > 0) {

      this.batches.forEach(mgb => {
        total = total + mgb.sackQuantity;
      });

    }

    return total;
  }
}
