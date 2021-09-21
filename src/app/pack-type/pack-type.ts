import { TypeCoffee } from './type-coffee';
import { GenericType } from './generic-type';
import { NumberHelper } from '../shared/globalization';
import { ServiceItem } from '../service-item/service-item';
import {ChecklistType} from "../checklist/checklist-type";

export class PackType {

  static fromListData(listData: Array<PackType>): Array<PackType> {
    return listData.map((data) => {
      return PackType.fromData(data);
    });
  }

  static fromData(data?: PackType): PackType {
    if (!data) {
      return new this();
    }

    let packType = new this(
      data.id,
      data.code,
      data.description,
      data.weight,
      data.capacity,
      data.trackStock,
      data.rentServiceItem,
      data.storageServiceItem,
      data.loadUnloadServiceItem,
      data.genericType,
      data.checklistType,
    );
    return packType;
  }

  constructor(
    public id?: string,
    public code?: number,
    public description?: string,
    public weight?: number,
    public capacity?: number,
    public trackStock?: boolean,
    public rentServiceItem?: ServiceItem,
    public storageServiceItem?: ServiceItem,
    public loadUnloadServiceItem?: ServiceItem,
    public genericType?: string,
    public checklistType?: ChecklistType,
  ) {
    if (rentServiceItem) {
      this.rentServiceItem = ServiceItem.fromData(rentServiceItem);
    }

    if (storageServiceItem) {
      this.storageServiceItem = ServiceItem.fromData(storageServiceItem);
    }

    if (loadUnloadServiceItem) {
      this.loadUnloadServiceItem = ServiceItem.fromData(loadUnloadServiceItem);
    }
    if (checklistType) {
      this.checklistType = ChecklistType.fromData(checklistType);
    }
  }

  get weightString(): string {
    return NumberHelper.toPTBR(this.weight);
  }

  get capacityString(): string {
    return NumberHelper.toPTBR(this.capacity);
  }

  set weightString(value) {
    this.weight = NumberHelper.fromPTBR(value);
  }

  set capacityString(value) {
    this.capacity = NumberHelper.fromPTBR(value);
  }

  get genericTypeObject() {
    return GenericType.fromData(this.genericType);
  }
}
