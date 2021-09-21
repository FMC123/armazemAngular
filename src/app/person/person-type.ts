export class PersonType {

  static PHYSICAL = PersonType.fromData('PHYSICAL');
  static JURIDICAL = PersonType.fromData('JURIDICAL');
  static PRODUCER = PersonType.fromData('PRODUCER');
  static INTERNATIONAL = PersonType.fromData('INTERNATIONAL');

  static fromListData(listData: Array<string>): Array<PersonType> {
    return listData.map((data) => {
      return PersonType.fromData(data);
    });
  }

  static fromData(data: string): PersonType {
    if (!data) return new this();
    let type = new this(data);
    return type;
  }

  static fromDataObject(data: PersonType): PersonType {
    if (!data) return new this();
    let personType = new this();
    return personType;
  }

  constructor(public code?: string) {}

  get name(){
    switch (this.code) {
      case 'PHYSICAL':
        return 'Física';
      case 'JURIDICAL':
        return 'Jurídica';
      case 'PRODUCER':
        return 'Produtor';
      case 'INTERNATIONAL':
        return 'Internacional';
      default:
        return null;
    }
  }

}
