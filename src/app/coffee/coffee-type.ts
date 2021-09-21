export class CoffeeType {

  static COFFEE = CoffeeType.fromData('CAFE');
  static ESCOLHA = CoffeeType.fromData('ESCO');

  static list(): Array<CoffeeType> {
    return [this.COFFEE, this.ESCOLHA];
  }

  static fromListData(listData: Array<string>): Array<CoffeeType> {
    return listData.map((data) => {
      return CoffeeType.fromData(data);
    });
  }

  static fromData(data: string): CoffeeType {
    if (!data) return new this();
    let type = new this(data);
    return type;
  }

  constructor(public code?: string) {}

  get name(){
    switch (this.code) {
      case 'CAFE':
        return 'Café';
      case 'ESCO':
        return 'Escolha';
      default:
        return null;
    }
  }

}
