import { ShippingAuthorizationType } from './shipping-authorization-type';
import { MarkupGroup } from '../markup-group/markup-group';
import { Batch } from '../batch/batch';
import { Warehouse } from '../warehouse/warehouse';
import { WarehouseStakeholder } from '../warehouse-stakeholder/warehouse-stakeholder';
import { DateTimeHelper } from '../shared/globalization/date-time-helper';

export class ShippingAuthorization {

  static fromListData(listData: Array<ShippingAuthorization>): Array<ShippingAuthorization> {
    return listData.map((data) => {
      return ShippingAuthorization.fromData(data);
    });
  }

  static fromData(data: ShippingAuthorization): ShippingAuthorization {
    if (!data) {
      return new this();
    }

    let shippingAuthorization = new this(
      data.id,
      data.code,
      data.expectedDate,
      data.warehouse,
      data.destinationWarehouse,
      data.sellCode,
      data.markupGroup,
      data.type,
      data.destinatary,
      data.observation
    );

    return shippingAuthorization;
  }

  constructor(
    public id?: string,
    public code?: string,
    public expectedDate?: number,
    public warehouse?: Warehouse,
    public destinationWarehouse?: Warehouse,
    public sellCode?: string,
    public markupGroup?: MarkupGroup,
    public type?: string,
    public destinatary?: WarehouseStakeholder,
    public observation?:string
  ) {
    if (warehouse) {
      this.warehouse = Warehouse.fromData(warehouse);
    }

    if (destinationWarehouse) {
      this.destinationWarehouse = Warehouse.fromData(destinationWarehouse);
    }

    if (markupGroup) {
      this.markupGroup = MarkupGroup.fromData(markupGroup);
    }

    if (destinatary) {
      this.destinatary = WarehouseStakeholder.fromData(destinatary);
    }
  }

  get editable() {
    return this.type === ShippingAuthorizationType.TRANSFERENCIA.code;
  }

  get isVenda() {
    return this.type ===  ShippingAuthorizationType.VENDA.code;
  }

  get expectedDateString(): string {
    return DateTimeHelper.toDDMMYYYY(this.expectedDate);
  }

  set expectedDateString(expectedDate: string) {
    this.expectedDate = DateTimeHelper.fromDDMMYYYY(expectedDate);
  }

  get batches() {
    return this.markupGroup.batches;
  }

  set batches(value) {
    this.markupGroup.batches = value;
  }

  get typeObject(): ShippingAuthorizationType {
    return ShippingAuthorizationType.fromData(this.type);
  }

  set typeObject(value: ShippingAuthorizationType) {
    if (value) {
      this.type = value.code;
    } else {
      this.type = null;
    }
  }
}
