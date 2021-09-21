export class OperationTypeType {

  static ENTRADA = OperationTypeType.fromData('E');
  static SAIDA_EXPORTACAO = OperationTypeType.fromData('S');
  static SAIDA_MERCADO_INTERNO = OperationTypeType.fromData('M');
  static TRANSFERENCIA = OperationTypeType.fromData('T');
  static OUTRAS_SAIDAS = OperationTypeType.fromData('O');
  static COMPRA_CAFE = OperationTypeType.fromData('C');

  static list(): Array<OperationTypeType> {
    return [
      this.ENTRADA,
      this.SAIDA_EXPORTACAO,
      this.SAIDA_MERCADO_INTERNO,
      this.TRANSFERENCIA,
      this.OUTRAS_SAIDAS,
      this.COMPRA_CAFE,
    ];
  }

  static fromData(data: string): OperationTypeType {
    if (!data) return new this();
    let status = new this(data);
    return status;
  }

  constructor(public code?: string) {}

  get name(){
    switch (this.code) {
      case 'E':
        return 'Entrada';
      case 'S':
        return 'Saída Exportação';
      case 'M':
        return 'Saída Merc. Interno';
      case 'T':
        return 'Transferência';
      case 'O':
        return 'Outras Saídas';
      case 'C':
        return 'Compra Café';
      default:
        return null;
    }
  }

}
