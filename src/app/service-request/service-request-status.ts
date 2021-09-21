export class ServiceRequestStatus {
  static OPENED = ServiceRequestStatus.fromData('OPENED');
  static ACTIVE = ServiceRequestStatus.fromData('ACTIVE');
  static FINISHED = ServiceRequestStatus.fromData('FINISHED');
  static CANCELED = ServiceRequestStatus.fromData('CANCELED');

  static list(): Array<ServiceRequestStatus> {
    return [this.OPENED, this.ACTIVE, this.FINISHED, this.CANCELED];
  }

  static fromListData(listData: Array<string>): Array<ServiceRequestStatus> {
    return listData.map((data) => {
      return ServiceRequestStatus.fromData(data);
    });
  }

  static fromData(data: string): ServiceRequestStatus {
    return (data) ? new this(data) : new this();
  }

  constructor(public code?: string) { }

  get name() {
    switch (this.code) {
      case 'OPENED':
        return 'Aberta';
      case 'ACTIVE':
        return 'Ativa';
      case 'FINISHED':
        return 'Fechada';
      case 'CANCELED':
        return 'Cancelada';
      default:
        return this.code;
    }
  }

}
