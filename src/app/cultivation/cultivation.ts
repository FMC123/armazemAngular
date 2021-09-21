export class Cultivation {

  static fromListData(listData: Array<Cultivation>): Array<Cultivation> {
    return listData.map((data) => {
      return Cultivation.fromData(data);
    });
  }

  static fromData(data: Cultivation): Cultivation {
    if (!data) return new this();

    let cultivation = new this(
      data.id,
      data.cultivationName,
      data.cultivationDescription,
    );

    return cultivation;
  }

   constructor(
      public id?: string,
      public cultivationName?: string,
      public cultivationDescription?: number,
    ){}

}
