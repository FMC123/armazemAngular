export class FiscalNoteType {

  static TRANSPORTATION_IN = FiscalNoteType.fromData('TRANSPORTATION_IN');
  static TRANSPORTATION_OUT = FiscalNoteType.fromData('TRANSPORTATION_OUT');

  static list(): Array<FiscalNoteType> {
    return [
      this.TRANSPORTATION_IN,
      this.TRANSPORTATION_OUT
    ];
  }

  static fromData(data: string): FiscalNoteType {
    if (!data) return new this();
    let status = new this(data);
    return status;
  }

  constructor(public code?: string) {}

  get name(){
    switch (this.code) {
      case 'TRANSPORTATION_IN':
        return 'Movimentação de Entrada';
      case 'TRANSPORTATION_OUT':
        return 'Movimentação de Saída';
      default:
        return null;
    }
  }

}
