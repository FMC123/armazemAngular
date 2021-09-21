import { ShippingAuthorization } from '../shipping-authorization';
import { DateTimeHelper } from '../../shared/globalization';
import { URLSearchParams } from '@angular/http';

export class ShippingAuthorizationFilter {

  static fromListData(listData: Array<ShippingAuthorizationFilter>): Array<ShippingAuthorizationFilter> {
    return listData.map((data) => {
      return ShippingAuthorizationFilter.fromData(data);
    });
  }

  static fromData(data: ShippingAuthorizationFilter): ShippingAuthorizationFilter {
    if (!data) return new this();
    let filter = new this(
      data.search,
      data.searchStartDate,
      data.searchEndDate,
    );
    return filter;
  }

  constructor(
    public search?: string,
    public searchStartDate?: string,
    public searchEndDate?: string,
  ) {

  }

  get registrationDateStart(): number {
    return DateTimeHelper.fromDDMMYYYY(this.searchStartDate);
  }
  set registrationDateStart(value: number) {
    this.searchStartDate = DateTimeHelper.toDDMMYYYY(value);
  }

  get registrationDateEnd(): number {
    return DateTimeHelper.fromDDMMYYYY(this.searchEndDate);
  }
  set registrationDateEnd(value: number) {
    this.searchEndDate = DateTimeHelper.toDDMMYYYY(value);
  }

  public toURLSearchParams(): URLSearchParams {
    let params: URLSearchParams = new URLSearchParams();

    if (this.registrationDateStart) {
      params.set('searchStartDate', this.registrationDateStart + '');
    }

    if (this.registrationDateEnd) {
      params.set('searchEndDate', this.registrationDateEnd + '');
    }

    if (this.search) {
      params.set('search', this.search);
    }

    return params;
  }

}
