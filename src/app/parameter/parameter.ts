

import {Warehouse} from "../warehouse/warehouse";
export class Parameter {

  static fromListData(listData: Array<Parameter>): Array<Parameter>{
    return listData.map((data) => {
      return Parameter.fromData(data);
    });
  }

  static fromData(data: Parameter): Parameter {
    if (!data) return new this();
    let parameter = new this(
      data.id,
      data.code,
      data.keys,
      data.value,
      data.warehouse
    );
    return parameter;
  }

  constructor(public id?: string,
              public code?: number,
              public keys?: string,
              public value?: string,
              public warehouse?: Warehouse,
             ) {}


}
