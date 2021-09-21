import { User } from '../user/user';
import { DateTimeHelper, NumberHelper } from '../shared/globalization';

export class ServiceGroup {

  static fromListData(listData: Array<ServiceGroup>): Array<ServiceGroup>{
    return listData.map((data) => {
      return ServiceGroup.fromData(data);
    });
  }

  static fromData(data: ServiceGroup): ServiceGroup {
    if (!data) return new this();
    let serviceGroup = new this(
      data.id,
      data.code,
      data.description,
      data.indGroupToCalc
    );
    return serviceGroup;
  }

  constructor(public id?: string,
              public code?: number,
              public description?: string,
              public indGroupToCalc?: boolean) {
  }
}