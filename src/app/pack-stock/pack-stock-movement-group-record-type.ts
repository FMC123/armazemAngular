export class PackStockMovementGroupRecordType {

  static AUTOMATIC = PackStockMovementGroupRecordType.fromData('AUTOMATIC');
  static MANUAL = PackStockMovementGroupRecordType.fromData('MANUAL');

  static list(): Array<PackStockMovementGroupRecordType> {
    return [
      this.AUTOMATIC,
      this.MANUAL,
    ];
  }

  static fromData(data: string): PackStockMovementGroupRecordType {
    if (!data) return new this();
    let status = new this(data);
    return status;
  }

  constructor(public code?: string) {}

  get shortCode(){
    switch (this.code) {
      case 'AUTOMATIC':
        return 'A';
      case 'MANUAL':
        return 'M';
      default:
        return null;
    }
  }

}
