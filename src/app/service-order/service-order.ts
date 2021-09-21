import {ServiceItem} from "../service-item/service-item";

export class ServiceOrder {

  static fromListData(listData: Array<ServiceOrder>): Array<ServiceOrder> {
    return listData.map((data) => {
      return ServiceOrder.fromData(data);
    });
  }

  static fromData(data: ServiceOrder): ServiceOrder {
    if (!data) return new this();
    let order = new this(
      data.id,
      data.sacksQuantity,
      data.service,
      data.editable
    );
    return order;
  }

  constructor(public id?: string,
              public sacksQuantity?: number,
              public service?: ServiceItem,
              public editable?: boolean
  ) {
    if (!editable) {
      this.editable = false;
    }
  }

}
