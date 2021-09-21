export class TypeAddress {

  static CORRESPONDENCE = TypeAddress.fromData('CORRESPONDENCE');
  static COMMERCIAL = TypeAddress.fromData('COMMERCIAL');
  static RESIDENTIAL = TypeAddress.fromData('RESIDENTIAL');

  static fromListData(listData: Array<string>): Array<TypeAddress> {
    return listData.map((data) => {
      return TypeAddress.fromData(data);
    });
  }

  static fromData(data: string): TypeAddress {
    if (!data) return new this();
    let type = new this(data);
    return type;
  }

  static fromDataObject(data: TypeAddress): TypeAddress {
    if (!data) return new this();
    let city = new this();
    return city;
  }

  constructor(public code?: string) {}

  get name(){
    switch (this.code) {
      case 'CORRESPONDENCE':
        return 'Correspondência';
      case 'COMMERCIAL':
        return 'Comercial';
      case 'RESIDENTIAL' :
        return 'Residencial';
      default:
        return null;
    }
  }

}
