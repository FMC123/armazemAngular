export class ServiceRequestType {

  static SAMPLE = ServiceRequestType.fromData('SAMPLE');
  static ESPECIAL_COFFEE = ServiceRequestType.fromData('ESPECIAL_COFFEE');
  static DEVOLUTION = ServiceRequestType.fromData('DEVOLUTION');
  static SERVICE_INSTRUCTION = ServiceRequestType.fromData('SERVICE_INSTRUCTION');
  static LT_TO_PE = ServiceRequestType.fromData('LT_TO_PE');
  static RECLASSIFICATION = ServiceRequestType.fromData('RECLASSIFICATION');

  static list(): Array<ServiceRequestType> {
    return [this.SAMPLE, this.ESPECIAL_COFFEE, this.DEVOLUTION,
    this.SERVICE_INSTRUCTION, this.LT_TO_PE, this.RECLASSIFICATION];
  }

  static fromListData(listData: Array<string>): Array<ServiceRequestType> {
    return listData.map((data) => {
      return ServiceRequestType.fromData(data);
    });
  }

  static fromData(data: string): ServiceRequestType {
    return (data) ? new this(data) : new this();
  }

  constructor(public code?: string) { }

  get name() {
    switch (this.code) {
      case 'SAMPLE':
        return 'Amostra';
      case 'ESPECIAL_COFFEE':
        return 'Café Especial';
      case 'DEVOLUTION':
        return 'Devolução';
      case 'SERVICE_INSTRUCTION':
        return 'IS Física';
      case 'LT_TO_PE':
        return 'LT->PE';
      case 'RECLASSIFICATION':
        return 'Reclassificação';
      default:
        return this.code;
    }
  }
}
