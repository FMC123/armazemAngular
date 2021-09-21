import { WarehouseStakeholder } from '../warehouse-stakeholder/warehouse-stakeholder';
import { PackType } from '../pack-type/pack-type';
import { NumberHelper } from '../shared/globalization';

export class DbGroupPermission {

  static fromListData(listData: Array<DbGroupPermission>): Array<DbGroupPermission> {
    return listData.map((data) => {
      return DbGroupPermission.fromData(data);
    });
  }

  static fromData(data?: DbGroupPermission): DbGroupPermission {
    if (!data) {
      return new this();
    }

    let group = new this(
      data.id,
      data.name,
      data.checked
    );

    return group;
  }

  constructor(
    public id?: string,
    public name?: string,
    public checked?: boolean
  ) {

  }


}
