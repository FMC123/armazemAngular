export class Company {

  static fromListData(listData: Array<Company>): Array<Company> {
    return listData.map((data) => {
      return Company.fromData(data);
    });
  }

  static fromData(data: Company): Company {
    if (!data) return new this();

    let company = new this(
      data.id,
      data.name,
      data.codeAX,
    );

    return company;
  }

   constructor(
      public id?: string,
      public name?: string,
      public codeAX?: string,
    ){}

}
