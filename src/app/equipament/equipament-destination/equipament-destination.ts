import { Equipament } from '../equipament';
import {EquipamentDestinationIdentifier} from "./equipament-destination-identifier";

export class EquipamentDestination{

  static fromListData(listData: Array<EquipamentDestination>): Array<EquipamentDestination> {
    return listData.map((data) => {
      return EquipamentDestination.fromData(data);
    });
  }

  static fromData(data: EquipamentDestination): EquipamentDestination {
    if (!data) return new this();
    let equipamentDestination = new this(
      data.id,
      data.equipamentOrigin,
      data.identifier,
      data.destinationDescription,
      data.equipamentTarget,
    );
    return equipamentDestination;
  }

  constructor(
    public id?: string,
    public equipamentOrigin?: Equipament,
    public identifier?: string,
    public destinationDescription?: string,
    public equipamentTarget?: Equipament,
  ) {
    if (equipamentOrigin) {
      this.equipamentOrigin = Equipament.fromData(equipamentOrigin);
    }

    if (equipamentTarget) {
      this.equipamentTarget = Equipament.fromData(equipamentTarget);
    }

  }

  set identifierObject(value: EquipamentDestinationIdentifier){
    if (value) {
      this.identifier = value.code;
    }else {
      this.identifier = null;
    }
  }
  get identifierObject(): EquipamentDestinationIdentifier {
    return EquipamentDestinationIdentifier.fromData(this.identifier);
  }
}
