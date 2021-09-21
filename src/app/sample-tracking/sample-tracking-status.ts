//DEPRECATED CONFIRMAR PARA RETIRAR
export class SampleTrackingStatus {

  static OPENED = SampleTrackingStatus.fromData('OPENED');
  static CONFIRMED = SampleTrackingStatus.fromData('CONFIRMED');

  static list(): Array<SampleTrackingStatus> {
    return [this.OPENED, this.CONFIRMED];
  }

  static fromListData(listData: Array<string>): Array<SampleTrackingStatus> {
    return listData.map((data) => {
      return SampleTrackingStatus.fromData(data);
    });
  }

  static fromData(data: string): SampleTrackingStatus {
    return (data) ? new this(data) : new this();
  }

  constructor(public code?: string) {
  }

  get name() {
    switch (this.code) {
      case 'OPENED':
        return 'Aberto';
      case 'CONFIRMED':
        return 'Confirmado';
      default:
        return this.code;
    }
  }
}
