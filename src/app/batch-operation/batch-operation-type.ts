export class BatchOperationType {

  public static W_IN = BatchOperationType.fromData('W_IN');
  public static W_OUT = BatchOperationType.fromData('W_OUT');

  public static P_IN = BatchOperationType.fromData('P_IN');
  public static P_OUT = BatchOperationType.fromData('P_OUT');

  public static OT_IN = BatchOperationType.fromData('OT_IN');
  public static OT_OUT = BatchOperationType.fromData('OT_OUT');

  public static PP_IN = BatchOperationType.fromData('PP_IN');
  public static PP_OUT = BatchOperationType.fromData('PP_OUT');

  static list(): Array<BatchOperationType> {
    return [
      this.W_IN,
      this.W_OUT,
      this.P_IN,
      this.P_OUT,
      this.OT_IN,
      this.OT_OUT
    ];
  }

  static fromData(data: string): BatchOperationType {
    if (!data) return new this();
    let status = new this(data);
    return status;
  }

  constructor(public code?: string) { }

  get route() {
    switch (this.code) {
      case 'W_IN':
        return 'IN';
      case 'W_OUT':
        return 'OUT';
      case 'P_IN':
        return 'IN';
      case 'P_OUT':
        return 'OUT';
      case 'OT_IN':
        return 'IN';
      case 'OT_OUT':
        return 'OUT';
      case 'PP_IN':
        return 'IN';
      case 'PP_OUT':
        return 'OUT';
      default:
        return null;
    }
  }

  get name() {
    switch (this.code) {
      case 'W_IN':
        return 'Entrada para o Armazém';
      case 'W_OUT':
        return 'Saída/Despejo do Armazém';
      case 'P_IN':
        return 'Entrada do processo para o armazém';
      case 'P_OUT':
        return 'Despejo para processo';
      case 'OT_IN':
        return 'Transferência de Titularidade Destino';
      case 'OT_OUT':
        return 'Transferência de Titularidade Origem';
      case 'PP_IN':
        return 'Entrada de prospecto de compras';
      case 'PP_OUT':
        return 'Saída de prospecto de compras';
      default:
        return null;
    }
  }

  get color() {
    switch (this.code) {
      case 'W_IN':
        return '#d9edf7';
      case 'W_OUT':
        return '#f2dede';
      case 'P_IN':
        return '#d9edf7';
      case 'P_OUT':
        return '#f2dede';
      case 'OT_IN':
        return '#d9edf7';
      case 'OT_OUT':
        return '#f2dede';
      default:
        return null;
    }
  }
}