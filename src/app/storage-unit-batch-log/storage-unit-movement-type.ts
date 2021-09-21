export class StorageUnitMovementType {

  static E = StorageUnitMovementType.fromData('E');
  static M = StorageUnitMovementType.fromData('M');
  static S = StorageUnitMovementType.fromData('S');


  static list(): Array<StorageUnitMovementType> {
    return [
      this.E,
      this.M,
      this.S
    ];
  }

  static fromData(data: string): StorageUnitMovementType {
    if (!data) return new this();
    let storageunitmovementtype = new this(data);
    return storageunitmovementtype;
  }

  constructor(public code?: string) { }

  get name() {
    switch (this.code) {
      case 'E':
        return 'Entrada';
      case 'M':
        return 'Movimentação interna/remoção';
      case 'S':
        return 'Saída/Despejo';
      default:
        return null;
    }
  }

  get color() {
    switch (this.code) {
      case 'E':
        return '#d9edf7';
      case 'M':
        return '#f2dede';
      case 'S':
        return '#d9edf7';
      default:
        return null;
    }

  }
}
