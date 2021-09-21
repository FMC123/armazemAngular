export class BatchOperationStatus {

  static RESERVED = BatchOperationStatus.fromData('RESERVED');
  static OPEN = BatchOperationStatus.fromData('OPEN');
  static INITIED = BatchOperationStatus.fromData('INITIED');
  static STORED = BatchOperationStatus.fromData('STORED');
  static DUMPED = BatchOperationStatus.fromData('DUMPED');
  static CLOSED = BatchOperationStatus.fromData('CLOSED');
  static AUDITING = BatchOperationStatus.fromData('AUDITING');


  static list(): Array<BatchOperationStatus> {
    return [
      this.OPEN,
      this.RESERVED,
      this.INITIED,
      this.STORED,
      this.DUMPED,
      this.AUDITING,
      this.CLOSED,
    ];
  }

  static fromData(data: string): BatchOperationStatus {
    if (!data) return new this();
    let status = new this(data);
    return status;
  }

  constructor(public code?: string) {}

  get name(){
    switch (this.code) {
      case 'RESERVED':
        return 'Reservado';
      case 'OPEN':
        return 'Em aberto';
      case 'INITIED':
        return 'Iniciado';
      case 'STORED':
        return 'Armazenado';
      case 'DUMPED':
        return 'Despejado';
      case 'CLOSED':
        return 'Fechado';
      case 'AUDITING':
        return 'Audição';
      default:
        return null;
    }
  }
}
