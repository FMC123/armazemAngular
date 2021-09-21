export class MarkupGroupBatchStatus {

    static OPEN = MarkupGroupBatchStatus.fromData('OPEN');
    static LOADING = MarkupGroupBatchStatus.fromData('LOADING');
    static CLOSE = MarkupGroupBatchStatus.fromData('CLOSE');

    static list(): Array<MarkupGroupBatchStatus> {
      return [
        this.OPEN,
        this.CLOSE,
      ];
    }

    static fromData(data: string): MarkupGroupBatchStatus {
      if (!data) return new this();
      let markupGroupType = new this(data);
      return markupGroupType;
    }

    constructor(public code?: string) {}

    get name(){
      switch (this.code) {
        case 'OPEN':
          return 'Aberto';
        case 'LOADING':
          return 'Carregando';
        case 'CLOSE':
          return 'Fechado';
        default:
          return null;
      }
    }

  }
