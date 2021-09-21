import {Warehouse} from "../warehouse/warehouse";
export class Forklift {

  static fromListData(listData: Array<Forklift>): Array<Forklift>{
    return listData.map((data) => {
      return Forklift.fromData(data);
    });
  }

  static fromData(data: Forklift): Forklift {
    if (!data) return new this();
      let forklift = new this(
          data.id,
          data.name,
          data.model,
          data.uniqueIdentifier,
          data.active,
          data.inUse,
          data.warehouse
      );
      return forklift;
  }

  constructor(public id?: string,
              public name?: string,
              public model?: string,
              public uniqueIdentifier?: string,
              public active?: boolean,
              public inUse?: boolean,
              public warehouse?: Warehouse,
  ) {}

  get activeAsString(): string{
    if (this.active) {
      return "SIM"
    } else {
      return "NÃO"
    }
  }

  get inUseAsString(): string{
    if (this.inUse) {
      return "SIM"
    } else {
      return "NÃO"
    }
  }

}
