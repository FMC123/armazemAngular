export class Drink {

  static fromListData(listData: Array<Drink>): Array<Drink> {
    return listData.map((data) => {
      return Drink.fromData(data);
    });
  }

  static fromData(data: Drink): Drink {
    if (!data) return new this();

    let drink = new this(
      data.id,
      data.name,
      data.code,
      data.description,
    );

    return drink;
  }

   constructor(
      public id?: string,
      public name?: string,
      public code?: number,
      public description?: string,
    ){}

}
