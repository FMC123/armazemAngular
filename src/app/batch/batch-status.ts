export class BatchStatus {

  public static OPEN = BatchStatus.fromData('O');
  public static RECEIVING = BatchStatus.fromData('RN');
  public static AUDITING = BatchStatus.fromData('AD');
  public static RECEIVED = BatchStatus.fromData('RC');
  public static BAGGING = BatchStatus.fromData('BA');

  public static list(): Array<BatchStatus> {
    return [
      this.OPEN,
      this.RECEIVING,
      this.AUDITING,
      this.RECEIVED,
      this.BAGGING,
    ];
  }

  public static fromData(data: string): BatchStatus {
    if (!data) return new this();
    let status = new this(data);
    return status;
  }

  constructor(public code?: string) { }

  public get name() {
    switch (this.code) {
      case 'O':
        return 'Em aberto';
      case 'RN':
        return 'Recebendo';
      case 'AD':
        return 'Auditando';
      case 'RC':
        return 'Recebido';
      case 'BA':
        return 'Embegando';
      default:
        return null;
    }
  }
}