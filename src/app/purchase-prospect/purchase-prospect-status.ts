export class PurchaseProspectStatus {

  static OPENED = PurchaseProspectStatus.fromData('Aberta');
  static IN_CONTRACT = PurchaseProspectStatus.fromData('Em Contrato');
  static FINISHED = PurchaseProspectStatus.fromData('Fechada');
  static CANCELED = PurchaseProspectStatus.fromData('Cancelada');

  static list(): Array<PurchaseProspectStatus> {
    return [this.OPENED, this.IN_CONTRACT, this.FINISHED, this.CANCELED];
  }

  static fromListData(listData: Array<string>): Array<PurchaseProspectStatus> {
    return listData.map((data) => {
      return PurchaseProspectStatus.fromData(data);
    });
  }

  static fromData(data: string): PurchaseProspectStatus {
    return (data) ? new this(data) : new this();
  }

  constructor(public code?: string) { }

  get name() {
    switch (this.code) {
      case 'OPENED':
        return 'Aberta';
      case 'IN_CONTRACT':
        return 'Em Contrato';
      case 'FINISHED':
        return 'Finalizada';
      case 'CANCELED':
        return 'Cancelada';
      default:
        return this.code;
    }
  }
}
