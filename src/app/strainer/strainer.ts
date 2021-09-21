export class Strainer {

  static fromListData(listData: Array<Strainer>): Array<Strainer> {
    return listData.map((data) => {
      return Strainer.fromData(data);
    });
  }

    static fromData(data: Strainer): Strainer {
    if (!data) return new this();

    let strainer = new this(
      data.id,
      data.code,
      data.description,
      data.consume,
    );

    return strainer;
  }

   constructor(
        public id?: string,
        public code?: number,
        public description?: string,
        public consume?: number,
        ){}


  get consumeAsString(): string{
    if (this.consume === 0) {
      return "NÃO"
    } else {
      return "SIM"
    }
  }

}
