import { User } from '../user/user';
import { ServiceGroup } from '../service-group/service-group';
import { ServiceItem } from '../service-item/service-item';
import { DateTimeHelper, NumberHelper } from '../shared/globalization';

export class ServiceGroupItem {

  static fromListData(listData: Array<ServiceGroupItem>): Array<ServiceGroupItem>{
    return listData.map((data) => {
      return ServiceGroupItem.fromData(data);
    });
  }

  static fromData(data: ServiceGroupItem): ServiceGroupItem {
    if (!data) return new this();
    let serviceGroupItem = new this(
      data.id,
      data.serviceGroup,
      data.serviceItem,
    );
    return serviceGroupItem;
  }

  constructor(public id?: string,
              public serviceGroup?: ServiceGroup,
              public serviceItem?: ServiceItem,) {
  }
}
