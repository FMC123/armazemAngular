export class ClassificationProcessStatus {

  static PENDING_REQUEST = ClassificationProcessStatus.fromData('PENDING_REQUEST');
  static AWAITING_SAMPLE = ClassificationProcessStatus.fromData('AWAITING_SAMPLE');
  static SAMPLE_RECEIVED = ClassificationProcessStatus.fromData('SAMPLE_RECEIVED');
  static CLASSIF_REFUSED = ClassificationProcessStatus.fromData('CLASSIF_REFUSED');


  static list(): Array<ClassificationProcessStatus> {
    return [
      this.PENDING_REQUEST,
      this.AWAITING_SAMPLE,
      this.SAMPLE_RECEIVED,
    ];
  }

  static fromData(data: string): ClassificationProcessStatus {
    if (!data) return new this();
    let status = new this(data);
    return status;
  }

  constructor(public code?: string) {}

  get name(){
    switch (this.code) {
      case 'PENDING_REQUEST':
        return 'Pendente de Solicitação';
      case 'AWAITING_SAMPLE':
        return 'Aguardando Amostra';
      case 'SAMPLE_RECEIVED':
        return 'Amostra Recebida';
      case 'CLASSIF_REFUSED':
        return 'Classificação recusada';
      default:
        return null;
    }
  }
}
