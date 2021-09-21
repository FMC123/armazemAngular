export class IndicationSpecialCoffeeChannel {

  static SPECIAL_COFFEE = IndicationSpecialCoffeeChannel.fromData('SPECIAL_COFFEE');
  static CLASSIFICATION = IndicationSpecialCoffeeChannel.fromData('CLASSIFICATION');
  static PRODUCTOR = IndicationSpecialCoffeeChannel.fromData('PRODUCTOR');

  static list(): Array<IndicationSpecialCoffeeChannel> {
    return [
      this.SPECIAL_COFFEE,
      this.CLASSIFICATION,
      this.PRODUCTOR,
    ];
  }

  static fromData(data: string): IndicationSpecialCoffeeChannel {
    if (!data) return new this();
    let indication = new this(data);
    return indication;
  }

  constructor(public code?: string) { }

  get name() {
    switch (this.code) {
      case 'SPECIAL_COFFEE':
        return 'Café Especial';
      case 'CLASSIFICATION':
        return 'Classificação';
      case 'PRODUCTOR':
        return 'Produtor';
      default:
        return null;
    }
  }

}
