export class TypeRouteEquipment {

    static SILO_SILO = TypeRouteEquipment.fromData("SILO_SILO");
    static SILO_EMBEGADORA = TypeRouteEquipment.fromData("SILO_EMBEGADORA");
    static MOEGA_SILO = TypeRouteEquipment.fromData("MOEGA_SILO");
    static MOEGA_GRANEL = TypeRouteEquipment.fromData("MOEGA_GRANEL");
    static SILO_GRANEL = TypeRouteEquipment.fromData("SILO_GRANEL");
    static MOEGA_EMBEGADORA= TypeRouteEquipment.fromData("MOEGA_EMBEGADORA");

    static list(): Array<TypeRouteEquipment> {
      return [
        this.SILO_SILO,
        this.SILO_EMBEGADORA,
        this.MOEGA_SILO,
        this.MOEGA_GRANEL,
        this.SILO_GRANEL,
        this.MOEGA_EMBEGADORA
      ];
    }

    static fromListData(listData: Array<string>): Array<TypeRouteEquipment> {
      return listData.map((data) => {
        return TypeRouteEquipment.fromData(data);
      });
    }

    static fromData(data: string): TypeRouteEquipment {
      if (!data) return new this();
      let status = new this(data);
      return status;
    }

    static fromDataObject(data: TypeRouteEquipment): TypeRouteEquipment {
      if (!data) return new this();
      let routeData = new this();
      return routeData;
    }

    constructor(public code?: string) { }
  }

