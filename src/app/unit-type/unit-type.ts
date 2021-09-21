export class UnitType {

  static SC = UnitType.fromData('SC');
  static KG = UnitType.fromData('KG');

  static list(): Array<UnitType> {
    return [
      this.SC,
      this.KG,
    ];
  }

  static fromData(data: string): UnitType {
    if (!data) return new this();
    let unitType = new this(data);
    return unitType;
  }

  constructor(public code?: string) {}

  get name(){
    switch (this.code) {
      case 'SC':
        return 'Sacas';
      case 'KG':
        return 'Quilogramas';
      default:
        return null;
    }
  }

}
