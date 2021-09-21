import { URLSearchParams } from '@angular/http';
import { DateTimeHelper } from './../shared/globalization/date-time-helper';
import { Warehouse } from './../warehouse/warehouse';
import { User } from './../user/user';

export class AccessTokenFilter {

  static fromListData(listData: Array<AccessTokenFilter>): Array<AccessTokenFilter> {
    return listData.map((data) => {
      return AccessTokenFilter.fromData(data);
    });
  }

  static fromData(data: AccessTokenFilter): AccessTokenFilter {
    if (!data) return new this();
    let accessTokenFilter = new this(
      data.user,
      data.warehouse,
      data.forkliftId,
      data.initialCreatedDateString,
      data.finalCreatedDateString
    );
    return accessTokenFilter;
  }

  constructor(
    public user?: User,
    public warehouse?: Warehouse,
    public forkliftId?: string,
    public initialCreatedDateString?: string,
    public finalCreatedDateString?: string
  ) {
    this.user = User.fromData(user);
    this.warehouse = Warehouse.fromData(warehouse);
  }

  get initialCreatedDate(): number{
    return DateTimeHelper.fromDDMMYYYY(this.initialCreatedDateString);
  }

  set initialCreatedDate(value: number) {
		this.initialCreatedDateString = DateTimeHelper.toDDMMYYYY(value);
	}

  get finalCreatedDate(): number{
    return DateTimeHelper.fromDDMMYYYY(this.finalCreatedDateString);
  }
  set finalCreatedDate(value: number){
    this.finalCreatedDateString = DateTimeHelper.toDDMMYYYY(value);
  }

 public toURLSearchParams(): URLSearchParams {
    let params: URLSearchParams = new URLSearchParams();

    if (this.user.name) {
      params.set('user.name', this.user.name);
    }

    if (this.warehouse.id) {
      params.set('warehouse.id', this.warehouse.id);
    }

    if (this.forkliftId) {
      params.set('forkliftId', this.forkliftId);
    }

    if (this.initialCreatedDate) {
      params.set('initialCreatedDate', this.initialCreatedDate + '');
    }

    if (this.finalCreatedDate) {
      params.set('finalCreatedDate', this.finalCreatedDate + '');
    }

    if (this.initialCreatedDate) {
      params.set('initialCreatedDate', this.initialCreatedDate + '');
    }

    if (this.finalCreatedDate) {
      params.set('finalCreatedDate', this.finalCreatedDate + '');
    }

    return params;
  }

}
