export class ProductTransportationType {

  static COFFEE = ProductTransportationType.fromData('COFFEE');
  static COFFEE_PACKING = ProductTransportationType.fromData('COFFEE_PACKING');
  static PACKING = ProductTransportationType.fromData('PACKING');

  static list(): Array<ProductTransportationType> {
    return [
      this.COFFEE,
      this.COFFEE_PACKING,
      this.PACKING,
    ];
  }

  static fromData(data: string): ProductTransportationType {
    if (!data) return new this();
    let status = new this(data);
    return status;
  }

  constructor(public code?: string) {}

  get name(){
    switch (this.code) {
      case 'COFFEE':
        return 'Café';
      case 'COFFEE_PACKING':
        return 'Café e embalagem';
      case 'PACKING':
        return 'Embalagem';
      default:
        return null;
    }
  }

}
