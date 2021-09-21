import { URLSearchParams } from '@angular/http';
import { DateTimeHelper } from 'app/shared/globalization';

export class PurchaseOrderFilter {

  static fromListData(listData: Array<PurchaseOrderFilter>): Array<PurchaseOrderFilter> {
    return listData.map((data) => {
      return PurchaseOrderFilter.fromData(data);
    });
  }

  static fromData(data: PurchaseOrderFilter): PurchaseOrderFilter {
    if (!data) {
      return new this();
    }

    let purchaseOrderFilter = new this(
      data.downloadForecastDateStartString,
      data.downloadForecastDateEndString,
      data.clientId,
      data.loadingWarehouseId,
      data.packTypeId,
      data.purchaseOrderCode,
      data.status
    );

    return purchaseOrderFilter;
  }

  constructor(
    public downloadForecastDateStartString?: string,
    public downloadForecastDateEndString?: string,
    public clientId?: string,
    public loadingWarehouseId?: string,
    public packTypeId?: string,
    public purchaseOrderCode?: string,
    public status?: string
  ) {
  }

  get downloadForecastDateStart(): number {
    return DateTimeHelper.fromDDMMYYYY(this.downloadForecastDateStartString);
  }

  set downloadForecastDateStart(value: number) {
    this.downloadForecastDateStartString = DateTimeHelper.toDDMMYYYY(value);
  }

  get downloadForecastDateEnd(): number {
    return DateTimeHelper.fromDDMMYYYY(this.downloadForecastDateEndString);
  }

  set downloadForecastDateEnd(value: number) {
    this.downloadForecastDateEndString = DateTimeHelper.toDDMMYYYY(value);
  }

  public toURLSearchParams(): URLSearchParams {
    let params: URLSearchParams = new URLSearchParams();

    if (this.downloadForecastDateStart) {
      params.set('downloadForecastDateStart', this.downloadForecastDateStart + '');
    }

    if (this.downloadForecastDateEnd) {
      params.set('downloadForecastDateEnd', this.downloadForecastDateEnd + '');
    }

    if (this.clientId) {
      params.set('clientId', this.clientId);
    }

    if (this.loadingWarehouseId) {
      params.set('loadingWarehouseId', this.loadingWarehouseId);
    }

    if (this.packTypeId) {
      params.set('packTypeId', this.packTypeId);
    }

    if (this.purchaseOrderCode) {
      params.set('purchaseOrderCode', this.purchaseOrderCode);
    }

    if (this.status) {
      params.set('status', this.status);
    }

    return params;
  }
}