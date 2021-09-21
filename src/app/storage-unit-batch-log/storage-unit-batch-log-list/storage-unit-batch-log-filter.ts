import { URLSearchParams } from '@angular/http';
import { DateTimeHelper } from '../../shared/globalization';

export class StorageUnitBatchLogFilter {

  static fromListData(listData: Array<StorageUnitBatchLogFilter>): Array<StorageUnitBatchLogFilter> {
    return listData.map((data) => {
      return StorageUnitBatchLogFilter.fromData(data);
    });
  }

  static fromData(data: StorageUnitBatchLogFilter): StorageUnitBatchLogFilter {
    if (!data) {
      return new this();
    }

    let StorageUnitBatchLogFilter = new this(
      data.createdDateStartString,
      data.createdDateEndString,
      data.type,
      data.forkliftId,
      data.userName,
      data.positionCode,
      data.tagCode,
      data.batchOperationCode,
      data.batchCode,
      data.ownerName,
      data.quantity
    );

    return StorageUnitBatchLogFilter;
  }

  constructor(
    public createdDateStartString?: string,
    public createdDateEndString?: string,
    public type?: string,
    public forkliftId?: string,
    public userName?: string,
    public positionCode?: string,
    public tagCode?: string,
    public batchOperationCode?: string,
    public batchCode?: string,
    public ownerName?: string,
    public quantity?: string
  ) {
  }

  get createdDateStart(): number {
    return DateTimeHelper.fromDDMMYYYY(this.createdDateStartString);
  }
  set createdDateStart(value: number) {
    this.createdDateStartString = DateTimeHelper.toDDMMYYYY(value);
  }

  get createdDateEnd(): number {
    return DateTimeHelper.fromDDMMYYYY(this.createdDateEndString);
  }
  set createdDateEnd(value: number) {
    this.createdDateEndString = DateTimeHelper.toDDMMYYYY(value);
  }

  public toURLSearchParams(): URLSearchParams {
    let params: URLSearchParams = new URLSearchParams();

    if (this.createdDateStart) {
      params.set('createdDateStart', this.createdDateStart + '');
    }

    if (this.createdDateEnd) {
      params.set('createdDateEnd', this.createdDateEnd + '');
    }

    if (this.type) {
      params.set('type', this.type);
    }

    if (this.tagCode) {
      params.set('tagCode', this.tagCode);
    }

    if (this.batchCode) {
      params.set('batchCode', this.batchCode);
    }

    if (this.positionCode) {
      params.set('positionCode', this.positionCode);
    }

    if (this.forkliftId) {
      params.set('forkliftId', this.forkliftId);
    }

    if (this.userName) {
      params.set('userName', this.userName);
    }

    if (this.batchOperationCode) {
      params.set('batchOperationCode', this.batchOperationCode);
    }

    if (this.ownerName) {
      params.set('ownerName', this.ownerName);
    }

    if (this.quantity) {
      var q = this.quantity.replace(/\,/gi, ".");
      params.set('quantity', q);
    }

    return params;
  }
}