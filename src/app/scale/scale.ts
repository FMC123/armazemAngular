import {Warehouse} from "../warehouse/warehouse";
import {ModBusEquipament} from "../equipament/mod-bus-equipament/mod-bus-equipament";

export class Scale {

  static fromListData(listData: Array<Scale>): Array<Scale>{
    return listData.map((data) => {
      return Scale.fromData(data);
    });
  }

  static fromData(data: Scale): Scale {
    if (!data) return new this();
    let parameter = new this(
      data.id,
      data.ip,
      data.description,
      data.warehouse,
      data.model
    );
    return parameter;
  }

  constructor(public id?: string,
              public ip?: string,
              public description?: string,
              public warehouse?: Warehouse,
              public model?: ModBusEquipament,
             ) {}


}
