import { BatchStatus } from '../batch/batch-status';
import { Strainer } from '../strainer/strainer';
import { Drink } from '../drink/drink';
import { PackType } from '../pack-type/pack-type';
import { URLSearchParams } from '@angular/http';
import { DateTimeHelper } from './../shared/globalization/date-time-helper';
import { Warehouse } from './../warehouse/warehouse';
import { User } from './../user/user';

export class BatchLogFilter {

  static fromListData(listData: Array<BatchLogFilter>): Array<BatchLogFilter> {
    return listData.map((data) => {
      return BatchLogFilter.fromData(data);
    });
  }

  static fromData(data: BatchLogFilter): BatchLogFilter {
    if (!data) return new this();
    let accessTokenFilter = new this(
      data.user,
      data.warehouse,
      data.deviceId,
      data.initialCreatedDate,
      data.finalCreatedDate,
      data.initialCreatedDateString,
      data.finalCreatedDateString,
      data.packType,
      data.drink,
      data.strainer,
      data.batchStatus,
      data.batchCode,
      data.batchOperationCode,
      data.refClient
    );
    return accessTokenFilter;
  }

  constructor(
    public user?: User,
    public warehouse?: Warehouse,
    public deviceId?: string,
    public initialCreatedDate?: number,
    public finalCreatedDate?: number,
    initialCreatedDateString?: string,
    finalCreatedDateString?: string,
    public packType ?: PackType,
    public drink ?: Drink,
    public strainer?: Strainer,
    public batchStatus?: BatchStatus,
    public batchCode?: string,
    public batchOperationCode?: string,
    public refClient?: string
  ) {
    this.user = User.fromData(user);
    this.warehouse = Warehouse.fromData(warehouse);

    if (initialCreatedDateString) {
      this.initialCreatedDateString = initialCreatedDateString;
    }

    if (finalCreatedDateString) {
      this.finalCreatedDateString = finalCreatedDateString;
    }
  }

  get initialCreatedDateString(): string{
    return DateTimeHelper.toDDMMYYYY(this.initialCreatedDate);
  }
  set initialCreatedDateString(initialCreatedDateString: string){
    this.initialCreatedDate = DateTimeHelper.fromDDMMYYYY(initialCreatedDateString);
  }

  get finalCreatedDateString(): string{
    return DateTimeHelper.toDDMMYYYY(this.finalCreatedDate);
  }
  set finalCreatedDateString(finalCreatedDateString: string){
    this.finalCreatedDate = DateTimeHelper.fromDDMMYYYY(finalCreatedDateString, true /* endOfDay */);
  }

 public toURLSearchParams(): URLSearchParams {
    let params: URLSearchParams = new URLSearchParams();

    if (this.user.name) {
      params.set('user.name', this.user.name);
    }

    if (this.warehouse.id) {
      params.set('warehouse.id', this.warehouse.id);
    }

    if (this.deviceId) {
      params.set('deviceId', this.deviceId);
    }

    if (this.initialCreatedDate) {
      params.set('initialCreatedDate', this.initialCreatedDate + '');
    }

    if (this.finalCreatedDate) {
      params.set('finalCreatedDate', this.finalCreatedDate + '');
    }

    if (this.batchCode) {
      params.set('batchCode', this.batchCode);
    }

    if (this.batchOperationCode) {
      params.set('batchOperationCode', this.batchOperationCode);
    }

    if (this.batchStatus) {
      params.set('batchStatus', this.batchStatus.code);
    }

    if (this.drink && this.drink.id) {
      params.set('drink.id', this.drink.id);
    }

    if (this.packType && this.packType.id) {
      params.set('packType.id', this.packType.id);
    }

    if (this.strainer && this.strainer.id) {
      params.set('strainer.id', this.strainer.id);
    }

   if (this.refClient) {
     params.set('refClient', this.refClient);
   }

    return params;
  }

}
