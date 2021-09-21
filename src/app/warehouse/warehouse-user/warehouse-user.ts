import { User } from './../../user/user';
import { Warehouse } from './../warehouse';
import { Role } from './../../role/role';

export class WarehouseUser {

  static fromListData(listData: Array<WarehouseUser>): Array<WarehouseUser> {
    return listData.map((data) => {
      return WarehouseUser.fromData(data);
    });
  }

  static fromData(data: WarehouseUser): WarehouseUser {
    let warehouse = new this(
      data.id,
      User.fromData(data.user),
      Warehouse.fromData(data.warehouse, {skipWarehouseUser: true}),
      data.role
    );
    return warehouse;
  }

  constructor(public id?: string,
              public user?: User,
              public warehouse?: Warehouse,
              public role?: string) {
  }

  get roleObject(): Role {
    return Role.fromData(this.role);
  }
  set roleObject(value: Role){
    if (value) {
      this.role = value.code;
    }else {
      this.role = null;
    }
  }

}

