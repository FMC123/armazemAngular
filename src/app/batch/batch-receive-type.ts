export class BatchReceiveType {

    static NORMAL = BatchReceiveType.fromData('NORMAL');
    static OR = BatchReceiveType.fromData('OR');
    static TR = BatchReceiveType.fromData('TR');

    static list(): Array<BatchReceiveType> {
      return [
        this.NORMAL,
        this.OR,
        this.TR,
      ];
    }

    static fromData(data: string): BatchReceiveType {
      if (!data) return new this();
      let status = new this(data);
      return status;
    }

    constructor(public code?: string) {}

    get name(){
      switch (this.code) {
        case 'NORMAL':
          return 'Normal';
        case 'OR':
          return 'OR';
        case 'TR':
          return 'Transferência';
        default:
          return null;
      }
    }

  }
