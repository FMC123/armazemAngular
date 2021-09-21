export class RetentionStatus {

  static ACTIVE = RetentionStatus.fromData('ACTIVE');
  static INACTIVE = RetentionStatus.fromData('INACTIVE');

  static fromListData(listData: Array<string>): Array<RetentionStatus> {
    return listData.map((data) => {
      return RetentionStatus.fromData(data);
    });
  }

  static fromData(data: string): RetentionStatus {
    if (!data) return new this();
    let status = new this(data);
    return status;
  }

  static fromDataObject(data: RetentionStatus): RetentionStatus {
    if (!data) return new this();
    let retentionStatus = new this();
    return retentionStatus;
  }

  constructor(public code?: string) {}

  get name(){
    switch (this.code) {
      case 'ACTIVE':
        return 'ATIVO';
      case 'INACTIVE':
        return 'INATIVO';
      default:
        return null;
    }
  }

  get index(){
    switch (this.code) {
      case 'ACTIVE':
        return 0;
      case 'INACTIVE':
        return 1;
      default:
        return null;
    }
  }


}
