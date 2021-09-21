export class IndustrialType {

  static R = IndustrialType.fromData('R');
  static L = IndustrialType.fromData('L');
  static N = IndustrialType.fromData('N');

  static list(): Array<IndustrialType> {
    return [this.R, this.L, this.N];
  }

  static fromListData(listData: Array<string>): Array<IndustrialType> {
    return listData.map((data) => {
      return IndustrialType.fromData(data);
    });
  }

  static fromData(data: string): IndustrialType {
    if (!data) return new this();
    let type = new this(data);
    return type;
  }

  constructor(public code?: string) {}

  get name(){
    switch (this.code) {
      case 'R':
        return 'R - Rebeneficio';
      case 'L':
        return 'L - Liga';
      case 'N':
        return 'N - Não';
      default:
        return null;
    }
  }

  get shortName(){
    return this.code;
  }
}
