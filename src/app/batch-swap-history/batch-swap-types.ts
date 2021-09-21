export class BatchSwapType {

  static BATCH_SWAP = BatchSwapType.fromData('BATCH_SWAP');

  static list(): Array<BatchSwapType> {
    return [this.BATCH_SWAP];
  }

  static fromListData(listData: Array<string>): Array<BatchSwapType> {
    return listData.map((data) => {
      return BatchSwapType.fromData(data);
    });
  }

  static fromData(data: string): BatchSwapType {
    if (!data) return new this();
    let type = new this(data);
    return type;
  }

  constructor(public code?: string) {}

  get name() {
    switch (this.code) {
      case 'BATCH_SWAP':
        return 'Troca de Lote';
      default:
        return null;
    }
  }
}
