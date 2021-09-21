

export class ModBusEquipament {

    static fromListData(listData: Array<ModBusEquipament>): Array<ModBusEquipament>{
        return listData.map((data) => {
          return ModBusEquipament.fromData(data);
        });
      }
    
      static fromData(data: ModBusEquipament): ModBusEquipament {
        if (!data) return new this();
        let modBusEquipament = new this(
          data.name,
          data.code,
          data.description
        );
        return modBusEquipament;
      }
    
      constructor(
        public name?: string,
        public code?: string,
        public description?: string
      ) {}
    
}
