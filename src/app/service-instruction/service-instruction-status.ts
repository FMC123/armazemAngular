export class ServiceInstructionStatus {

  static OPENED = ServiceInstructionStatus.fromData('OPENED');
  static CONFIRMED = ServiceInstructionStatus.fromData('CONFIRMED');
  static AWAITING_BATCH = ServiceInstructionStatus.fromData('AWAITING_BATCH');
  static IN_PROCESS = ServiceInstructionStatus.fromData('IN_PROCESS');
  static AWAITING_CONFIRM = ServiceInstructionStatus.fromData('AWAITING_CONFIRM');
  static CANCELED = ServiceInstructionStatus.fromData('CANCELED');
  static FINISHED = ServiceInstructionStatus.fromData('FINISHED');

  static list(): Array<ServiceInstructionStatus> {
    return [this.OPENED, this.CONFIRMED, this.CANCELED, this.FINISHED, this.AWAITING_BATCH, this.IN_PROCESS, this.AWAITING_CONFIRM];
  }

  static fromListData(listData: Array<string>): Array<ServiceInstructionStatus> {
    return listData.map((data) => {
      return ServiceInstructionStatus.fromData(data);
    });
  }

  static fromData(data: string): ServiceInstructionStatus {
    return (data) ? new this(data) : new this();
  }

  constructor(public code?: string) {
  }

  get name() {
    switch (this.code) {
      case 'OPENED':
        return 'Aberta';
      case 'CONFIRMED':
        return 'Confirmada';
      case 'AWAITING_BATCH':
        return 'Pendente de Recebimento';
      case 'IN_PROCESS':
        return 'Em processo';
      case 'AWAITING_CONFIRM':
        return 'Pendente de Confirmação';
      case 'CANCELED':
        return 'Cancelada';
      case 'FINISHED':
        return 'Finalizada';
      default:
        return this.code;
    }
  }
}
