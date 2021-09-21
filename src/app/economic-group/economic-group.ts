export class EconomicGroup {

  static fromListData(listData: Array<EconomicGroup>): Array<EconomicGroup> {
    return listData.map((data) => {
      return EconomicGroup.fromData(data);
    });
  }

    static fromData(data: EconomicGroup): EconomicGroup {
    if (!data) return new this();

    let economicGroup = new this(
      data.id,
      data.code,
      data.description,
    );

    return economicGroup;
  }

   constructor(
        public id?: string,
        public code?: number,
        public description?: string,
        ){}

}
