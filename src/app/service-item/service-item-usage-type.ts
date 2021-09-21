export class ServiceItemUsageType {

  static SI = ServiceItemUsageType.fromData('SI');
  static CD = ServiceItemUsageType.fromData('CD');
  static CA = ServiceItemUsageType.fromData('CA');

  static list(): Array<ServiceItemUsageType> {
    return [this.SI, this.CD, this.CA];
  }

  static fromListData(listData: Array<string>): Array<ServiceItemUsageType> {
    return listData.map((data) => {
      return ServiceItemUsageType.fromData(data);
    });
  }

  static fromData(data: string): ServiceItemUsageType {
    return (data) ? new this(data) : new this();
  }

  constructor(public code?: string) {
  }

  get name() {
    switch (this.code) {
      case 'SI':
        return 'Instrução de serviço';
      case 'CD':
        return 'Cobrança - Desconto';
      case 'CA':
        return 'Cobrança - Acréscimo';
      default:
        return '';
    }
  }
}