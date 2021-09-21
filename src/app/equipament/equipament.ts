import { Warehouse } from '../warehouse/warehouse';
import { EquipamentType } from './equipament-type/equipament-type';
export class Equipament {

  static fromListData(listData: Array<Equipament>): Array<Equipament> {
    return listData.map((data) => {
      return Equipament.fromData(data);
    });
  }

  static fromData(data: Equipament): Equipament {
    if (!data) {
      return new this();
    }

    let equipament = new this(
      data.id,
      data.code,
      data.description,
      data.type,
      data.warehouse,
    );

    return equipament;
  }

  constructor(
    public id?: string,
    public code?: string,
    public description?: string,
    public type?: EquipamentType,
    public warehouse?: Warehouse,
  ) {
    if (type) {
      this.type = EquipamentType.fromData(type);
    }

    if (warehouse) {
      this.warehouse = Warehouse.fromData(warehouse);
    }
  }

}
