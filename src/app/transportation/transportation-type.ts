export class TransportationType {

  static IN = TransportationType.fromData('IN');
  static OUT = TransportationType.fromData('OUT');

  static list(): Array<TransportationType> {
    return [
      this.IN,
      this.OUT,
    ];
  }

  static fromData(data: string): TransportationType {
    if (!data) return new this();
    let status = new this(data);
    return status;
  }

  constructor(public code?: string) {}

  get name(){
    switch (this.code) {
      case 'IN':
        return 'Entrada';
      case 'OUT':
        return 'Saída';
      default:
        return null;
    }
  }

}
