import {URLSearchParams} from '@angular/http';
import {DateTimeHelper} from '../shared/globalization';
import {Warehouse} from '../warehouse/warehouse';
import {User} from '../user/user';

export class SkuFilter {

  static fromListData(listData: Array<SkuFilter>): Array<SkuFilter> {
    return listData.map((data) => {
      return SkuFilter.fromData(data);
    });
  }

  static fromData(data: SkuFilter): SkuFilter {
    if (!data) return new this();
    const SkuFilter = new this(
      data.company_id,
      data.created_by,
      data.created_date,
      data.last_modified_by,
      data.last_modified_date,
      data.deleted_by,
      data.deleted_date,
      data.product,
      data.description,
      data.code,
      data.measurementUnit,
      data.measurementAcronym,
      data.skuGroup,
      data.skuQuantity,
    );
    return SkuFilter;
  }

  constructor(
    public company_id?: any,
    public created_by?: any,
    public created_date?: any,
    public last_modified_by?: any,
    public last_modified_date?: any,
    public deleted_by?: any,
    public deleted_date?: any,
    public product?: any,
    public description?: any,
    public code?: any,
    public measurementUnit?: any,
    public measurementAcronym?: any,
    public skuGroup?: any,
    public skuQuantity?: any,
  ) {
    // this.user = User.fromData(user);
    // this.warehouse = Warehouse.fromData(warehouse);
    //
    // if (initialCreatedDateString) {
    //   this.initialCreatedDateString = initialCreatedDateString;
    // }
    //
    // if (finalCreatedDateString) {
    //   this.finalCreatedDateString = finalCreatedDateString;
    // }
  }

  // get initialCreatedDateString(): string{
  //   return DateTimeHelper.toDDMMYYYY(this.initialCreatedDate);
  // }
  // set initialCreatedDateString(initialCreatedDateString: string){
  //   this.initialCreatedDate = DateTimeHelper.fromDDMMYYYY(initialCreatedDateString);
  // }
  //
  // get finalCreatedDateString(): string{
  //   return DateTimeHelper.toDDMMYYYY(this.finalCreatedDate);
  // }
  // set finalCreatedDateString(finalCreatedDateString: string){
  //   this.finalCreatedDate = DateTimeHelper.fromDDMMYYYY(finalCreatedDateString, true /* endOfDay */);
  // }

  public toURLSearchParams(): URLSearchParams {
    let params: URLSearchParams = new URLSearchParams();

    // if (this.user.name) {
    //   params.set('user.name', this.user.name);
    // }
    //
    // if (this.warehouse.id) {
    //   params.set('warehouse.id', this.warehouse.id);
    // }
    //
    // if (this.forkliftId) {
    //   params.set('forkliftId', this.forkliftId);
    // }
    //
    // if (this.initialCreatedDate) {
    //   params.set('initialCreatedDate', this.initialCreatedDate + '');
    // }
    //
    // if (this.finalCreatedDate) {
    //   params.set('finalCreatedDate', this.finalCreatedDate + '');
    // }

    return params;
  }

}
