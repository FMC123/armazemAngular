export class MarkupGroupType {

    static BATCH_OPERATION = MarkupGroupType.fromData('BATCH_OPERATION');
    static SHIPPING_AUTHORIZATION = MarkupGroupType.fromData('SHIPPING_AUTHORIZATION');
    static GENERIC = MarkupGroupType.fromData('GENERIC');
    static SAMPLE_RESERVATION = MarkupGroupType.fromData('SAMPLE_RESERVATION');
    static SERVICE_INSTRUCTION = MarkupGroupType.fromData('SERVICE_INSTRUCTION');

    static list(): Array<MarkupGroupType> {
      return [
        this.BATCH_OPERATION,
        this.SHIPPING_AUTHORIZATION,
        this.GENERIC,
        this.SAMPLE_RESERVATION,
        this.SERVICE_INSTRUCTION
      ];
    }

    static fromData(data: string): MarkupGroupType {
      if (!data) return new this();
      let markupGroupType = new this(data);
      return markupGroupType;
    }

    constructor(public code?: string) {}

    get name(){
      switch (this.code) {
        case 'BATCH_OPERATION':
          return 'Romaneio';
        case 'SHIPPING_AUTHORIZATION':
          return 'Autorização de Embarque';
        case 'GENERIC':
          return 'Genérico';
        case 'SAMPLE_RESERVATION':
          return 'Reserva de Amostras';
        case 'SERVICE_INSTRUCTION':
          return 'Instrução de Serviço';
        default:
          return null;
      }
    }

    get priority(){
      switch (this.code) {
        case 'BATCH_OPERATION':
          return 3;
        case 'GENERIC':
          return 2;
        case 'SHIPPING_AUTHORIZATION':
          return 1;
        case 'SERVICE_INSTRUCTION':
          return 0;
        default:
          return -1;
      }
    }

  }
