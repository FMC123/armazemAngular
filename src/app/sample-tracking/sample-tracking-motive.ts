export class SampleTrackingMotive {
  static SPECIAL_COFFEE = SampleTrackingMotive.fromData('SPECIAL_COFFEE');
  static BLEND = SampleTrackingMotive.fromData('BLEND');
  static FOR_SALE = SampleTrackingMotive.fromData('FOR_SALE');

  static list(): Array<SampleTrackingMotive> {
    return [this.SPECIAL_COFFEE, this.BLEND, this.FOR_SALE];
  }

  static fromListData(listData: Array<string>): Array<SampleTrackingMotive> {
    return listData.map((data) => {
      return SampleTrackingMotive.fromData(data);
    });
  }

  static fromData(data: string): SampleTrackingMotive {
    if (!data) return new this();
    return new this(data);
  }

  constructor(public code?: string) {}

  get description(){
    switch (this.code) {
      case 'SPECIAL_COFFEE':
        return 'Café especial';
      case 'BLEND':
        return 'Criação de Liga';
      case 'FOR_SALE':
        return 'Venda';
      default:
        return null;
    }
  }
}
