export class StatusPerson {

  static ACTIVE = StatusPerson.fromData(1);
  static INACTIVE = StatusPerson.fromData(0);

  static fromListData(listData: Array<number>): Array<StatusPerson> {
    return listData.map((data) => {
      return StatusPerson.fromData(data);
    });
  }

  static fromData(data: number): StatusPerson {
    if (!data) return new this();
    let type = new this(data);
    return type;
  }

  static fromDataObject(data: StatusPerson): StatusPerson {
    if (!data) return new this();
    let city = new this();
    return city;
  }

  constructor(public code?: number) {}

  get name(){
    switch (this.code) {
      case 1:
        return 'Ativo';
      case 0:
        return 'Inativo';
      default:
        return null;
    }
  }

}
