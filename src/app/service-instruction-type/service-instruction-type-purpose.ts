export class ServiceInstructionTypePurpose {

  static PREPARATION = ServiceInstructionTypePurpose.fromData('PREPARATION');
  static REBENEFIT = ServiceInstructionTypePurpose.fromData('REBENEFIT');
  static FUSION = ServiceInstructionTypePurpose.fromData('FUSION');
  static TRANSFERENCE = ServiceInstructionTypePurpose.fromData('TRANSFERENCE');
  static EXCHANGE = ServiceInstructionTypePurpose.fromData('EXCHANGE');
  static FOR_SALE = ServiceInstructionTypePurpose.fromData('FOR_SALE');
  static CHARGE = ServiceInstructionTypePurpose.fromData('CHARGE');

  static list(): Array<ServiceInstructionTypePurpose> {
    return [this.PREPARATION, this.REBENEFIT, this.FUSION, this.TRANSFERENCE, this.EXCHANGE, this.FOR_SALE, this.CHARGE];
  }

  static fromListData(listData: Array<string>): Array<ServiceInstructionTypePurpose> {
    return listData.map((data) => {
      return ServiceInstructionTypePurpose.fromData(data);
    });
  }

  static fromData(data: string): ServiceInstructionTypePurpose {
    return (data) ? new this(data) : new this();
  }

  constructor(public code?: string) { }

  get name() {
    switch (this.code) {
      case 'PREPARATION':
        return 'Preparo';
      case 'TRANSFERENCE':
        return 'Transferência';
      case 'REBENEFIT':
        return 'Rebenefício';
      case 'FUSION':
        return 'Liga';
      case 'EXCHANGE':
        return 'Troca';
      case 'FOR_SALE':
        return 'Venda';
      case 'CHARGE':
        return 'Cobrança';
      default:
        return null;
    }
  }
}
