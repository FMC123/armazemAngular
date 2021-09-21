export class PurchaseOrderStatus {

  static TO_DISCHARGE = PurchaseOrderStatus.fromData('TO_DISCHARGE');
  static PARTIALLY_DISCHARGED = PurchaseOrderStatus.fromData('PARTIALLY_DISCHARGED');
  static DISCHARGED = PurchaseOrderStatus.fromData('DISCHARGED');

  static list(): Array<PurchaseOrderStatus> {
    return [this.TO_DISCHARGE, this.PARTIALLY_DISCHARGED, this.DISCHARGED];
  }

  static fromData(data: string): PurchaseOrderStatus {
    return (data) ? new this(data) : new this();
  }

  constructor(public code?: string) { }

  get name() {
    switch (this.code) {
      case 'TO_DISCHARGE':
        return 'A descarregar';
      case 'PARTIALLY_DISCHARGED':
        return 'Parcialmente descarregado';
      case 'DISCHARGED':
        return 'Descarregado';
      default:
        return this.code;
    }
  }

  get collor() {
    switch (this.code) {
      case 'TO_DISCHARGE':
        return '#FFD6AA';
      case 'PARTIALLY_DISCHARGED':
        return '#81FFFE';
      case 'DISCHARGED':
        return '#01AF29';
      default:
        return this.code;
    }
  }  
}