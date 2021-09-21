export class ShippingAuthorizationType {

    static TRANSFERENCIA = ShippingAuthorizationType.fromData('TRANSFERENCIA');
    static VENDA = ShippingAuthorizationType.fromData('VENDA');
    static DEVOLUCAO = ShippingAuthorizationType.fromData('DEVOLUCAO');
    static ORDEM_REBENEFICIAMENTO = ShippingAuthorizationType.fromData('ORDEM_REBENEFICIAMENTO');

    static list(): Array<ShippingAuthorizationType> {
      return [this.TRANSFERENCIA, this.VENDA, this.DEVOLUCAO, this.ORDEM_REBENEFICIAMENTO];
    }

    static fromListData(listData: Array<string>): Array<ShippingAuthorizationType> {
      return listData.map((data) => {
        return ShippingAuthorizationType.fromData(data);
      });
    }

    static fromData(data: string): ShippingAuthorizationType {
      if (!data) return new this();
      let status = new this(data);
      return status;
    }

    constructor(public code?: string) {}

    get name(){
      switch (this.code) {
        case 'TRANSFERENCIA':
          return 'Transferência';
        case 'VENDA':
          return 'Venda';
        case 'DEVOLUCAO':
          return 'Devolução';
        case 'ORDEM_REBENEFICIAMENTO':
          return 'Ordem Rebeneficiamento';
        default:
          return null;
      }
    }
  }