import { Warehouse } from '../../warehouse/warehouse';
import { Equipament } from '../equipament';
import { EquipamentTypeFunction } from '../equipament-type-function/equipament-type-function';

export class EquipamentTag {

  static fromListData(listData: Array<EquipamentTag>): Array<EquipamentTag> {
    return listData.map((data) => {
      return EquipamentTag.fromData(data);
    });
  }

  static fromData(data: EquipamentTag): EquipamentTag {
    if (!data) return new this();
    let equipamentTag = new this(
      data.id,
      data.code,
      data.equipament,
      data.equipamentTypeFunction,
      data.warehouse,
    );
    return equipamentTag;
  }

  constructor(
    public id?: string,
    public code?: string,
    public equipament?: Equipament,
    public equipamentTypeFunction?: EquipamentTypeFunction,
    public warehouse?: Warehouse,
  ) {
    if (equipament) {
      this.equipament = Equipament.fromData(equipament);
    }

    if (equipamentTypeFunction) {
      this.equipamentTypeFunction = EquipamentTypeFunction.fromData(equipamentTypeFunction);
    }

    if (warehouse) {
      this.warehouse = Warehouse.fromData(warehouse);
    }
  }

}
