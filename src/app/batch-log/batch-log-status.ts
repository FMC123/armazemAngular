export class BatchLogStatus {

  static OPEN = BatchLogStatus.fromData('O');
  static RECEIVING = BatchLogStatus.fromData('RN');
  static AUDITING = BatchLogStatus.fromData('AD');
  static RECEIVED = BatchLogStatus.fromData('RC');

  static list(): Array<BatchLogStatus> {
    return [
      this.OPEN,
      this.RECEIVING,
      this.AUDITING,
      this.RECEIVED,
    ];
  }

  static fromData(data: string): BatchLogStatus {
    if (!data) return new this();
    let status = new this(data);
    return status;
  }

  constructor(public code?: string) {}

  get name(){
    switch (this.code) {
      case 'O':
        return 'Em aberto';
      case 'RN':
        return 'Recebendo';
      case 'AD':
        return 'Auditando';
      case 'RC':
        return 'Recebido';
      default:
        return null;
    }
  }

}
