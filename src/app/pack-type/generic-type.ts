export class GenericType {

    static GRANEL = GenericType.fromData('G');
    static BIG_BAG = GenericType.fromData('B');
    static SACAS = GenericType.fromData('S');
    static RECEPTACLE = GenericType.fromData('R');

    static list(): Array<GenericType> {
      return [
        this.GRANEL,
        this.BIG_BAG,
        this.SACAS,
        this.RECEPTACLE
      ];
    }

    static fromListData(listData: Array<string>): Array<GenericType> {
      return listData.map((data) => {
        return GenericType.fromData(data);
      });
    }

    static fromData(data: string): GenericType {
      if (!data) return new this();
      let status = new this(data);
      return status;
    }

    static fromDataObject(data: GenericType): GenericType {
      if (!data) return new this();
      let genericType = new this();
      return genericType;
    }

    constructor(public code?: string) {}

    get name(){
      switch (this.code) {
        case 'G':
          return 'Granel';
        case 'B':
          return 'Big Bag';
        case 'S':
          return 'Sacas';
        case 'R':
          return 'Receptáculo de transporte'
        default:
          return null;
      }
    }

  }
