import {WarehouseStakeholder} from "../../warehouse-stakeholder/warehouse-stakeholder";
import {Collaborator} from "../../collaborator/collaborator";

export class ClassifSpecialCoffeeFilter {
    static fromListData(listData: Array<ClassifSpecialCoffeeFilter>): Array<ClassifSpecialCoffeeFilter> {
        return listData.map((data) => {
            return ClassifSpecialCoffeeFilter.fromData(data);
        });
    }

    static fromData(data: ClassifSpecialCoffeeFilter): ClassifSpecialCoffeeFilter {
        if (!data) return new this();
        let batch = new this(
            data.dateStart,
            data.dateEnd,
            data.specialCoffeeSituation,
            data.clientStakeholder,
            data.collaborator,
            data.coffeeSituation,
        );
        return batch;
    }

    constructor(
        public dateStart?: number,
        public dateEnd?: number,
        public specialCoffeeSituation?: string,
        public clientStakeholder?: WarehouseStakeholder,
        public collaborator?: Collaborator,
        public coffeeSituation?: string,
    ) {
      if (clientStakeholder) {
        this.clientStakeholder = WarehouseStakeholder.fromData(clientStakeholder);
      }

      if (collaborator) {
        this.collaborator = Collaborator.fromData(collaborator);
      }
    }
}
