import { DateTimeHelper } from '../../shared/globalization';
import { URLSearchParams } from '@angular/http';

export class PackStockFilter {

  static fromListData(listData: Array<PackStockFilter>): Array<PackStockFilter> {
    return listData.map((data) => {
      return PackStockFilter.fromData(data);
    });
  }

  static fromData(data: PackStockFilter): PackStockFilter {
    if (!data) return new this();
    let filter = new this(
      data.registrationDateStartString,
      data.registrationDateEndString,
      data.ownerId,
      data.packTypeIds,
    );
    return filter;
  }

  constructor(
    public registrationDateStartString?: string,
    public registrationDateEndString?: string,
    public ownerId?: string,
    public packTypeIds?: Array<string>,
  ) {

  }

  get registrationDateStart(): number {
    return DateTimeHelper.fromDDMMYYYY(this.registrationDateStartString);
  }
  set registrationDateStart(value: number) {
    this.registrationDateStartString = DateTimeHelper.toDDMMYYYY(value);
  }

  get registrationDateEnd(): number {
    return DateTimeHelper.fromDDMMYYYY(this.registrationDateEndString);
  }
  set registrationDateEnd(value: number) {
    this.registrationDateEndString = DateTimeHelper.toDDMMYYYY(value);
  }

  public toURLSearchParams(): URLSearchParams {
    let params: URLSearchParams = new URLSearchParams();

    if (this.registrationDateStart) {
      params.set('registrationDateStart', this.registrationDateStart + '');
    }

    if (this.registrationDateEnd) {
      params.set('registrationDateEnd', this.registrationDateEnd + '');
    }

    if (this.ownerId) {
      params.set('owner', this.ownerId);
    }

    if (this.packTypeIds) {
      params.set('packTypeIds', this.packTypeIds.join());
    }

    return params;
  }

}
