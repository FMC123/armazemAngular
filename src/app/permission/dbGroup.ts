import { DbGroupPermission } from './dbGroupPermission';
import { WarehouseStakeholder } from '../warehouse-stakeholder/warehouse-stakeholder';
import { PackType } from '../pack-type/pack-type';
import { NumberHelper } from '../shared/globalization';
import { User } from 'app/user/user';

export class DbGroup {

  static fromListData(listData: Array<DbGroup>): Array<DbGroup> {
    return listData.map((data) => {
      return DbGroup.fromData(data);
    });
  }

  static fromData(data?: DbGroup): DbGroup {
    if (!data) {
      return new this();
    }

    let group = new this(
      data.id,
      data.name,
      data.admin,
      data.leader,
      data.permissoes,
      data.usuarios
    );

    return group;
  }

  constructor(
    public id?: string,
    public name?: string,
    public admin?: boolean,
    public leader?: boolean,
    public permissoes ?: Array<DbGroupPermission>,
    public usuarios ?: Array<User>
  ) {

  }


}
