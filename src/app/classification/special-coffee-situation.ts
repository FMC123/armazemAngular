export class SpecialCoffeeSituation {

  static BOTH = SpecialCoffeeSituation.fromData('BOTH');
  static ANALIZED = SpecialCoffeeSituation.fromData('ANALIZED');
  static CONFIRMED = SpecialCoffeeSituation.fromData('CONFIRMED');
  static NOT_CONFIRMED = SpecialCoffeeSituation.fromData('NOT_CONFIRMED');
  static NOT_ANALYZED = SpecialCoffeeSituation.fromData('NOT_ANALYZED');
  static NOT_INDICATED = SpecialCoffeeSituation.fromData('NOT_INDICATED');

  static list(): Array<SpecialCoffeeSituation> {
    return [
      this.CONFIRMED,
      this.NOT_CONFIRMED,
    ];
  }

  static listByFilter(): Array<SpecialCoffeeSituation> {
    return [
      this.NOT_ANALYZED,
      this.ANALIZED,
      this.CONFIRMED,
      this.NOT_CONFIRMED,
      this.NOT_INDICATED
    ];
  }

  static listByReportSpecialCoffee(): Array<SpecialCoffeeSituation> {
    return [
      this.BOTH,
      this.CONFIRMED,
      this.NOT_CONFIRMED,
    ];
  }

  static fromData(data: string): SpecialCoffeeSituation {
    if (!data) return new this();
    let status = new this(data);
    return status;
  }

  constructor(public code?: string) {}

  get name(){
    switch (this.code) {
      case 'BOTH':
        return 'Ambos';
      case 'ANALIZED':
        return 'Analisados';
      case 'CONFIRMED':
        return 'Confirmado';
      case 'NOT_CONFIRMED':
        return 'Não Confirmado';
      case 'NOT_ANALYZED':
        return 'Não Analisado';
      case 'NOT_INDICATED':
        return 'Não Indicados';
      default:
        return null;
    }
  }
}
