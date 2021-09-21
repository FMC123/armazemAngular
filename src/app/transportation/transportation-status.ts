export class TransportationStatus {

  static AGUARDANDO_ENTRADA = TransportationStatus.fromData('AGUARDANDO_ENTRADA');
  static AUTORIZACAO_EFETUADA = TransportationStatus.fromData('AUTORIZACAO_EFETUADA');
  static PROCESSO_CARGA_DESCARGA = TransportationStatus.fromData('PROCESSO_CARGA_DESCARGA');
  static SOLICITADO_ENTRADA = TransportationStatus.fromData('SOLICITADO_ENTRADA');
  static AGUARDANDO_LIBERACAO = TransportationStatus.fromData('AGUARDANDO_LIBERACAO');
  static LIBERACAO_PERMITIDA = TransportationStatus.fromData('LIBERACAO_PERMITIDA');
  static FECHADO = TransportationStatus.fromData('FECHADO');

  static list(): Array<TransportationStatus> {
    return [
      this.AGUARDANDO_ENTRADA,
      this.AUTORIZACAO_EFETUADA,
      this.PROCESSO_CARGA_DESCARGA,
      this.AGUARDANDO_LIBERACAO,
      this.LIBERACAO_PERMITIDA,
      this.FECHADO,
    ];
  }

  static fromData(data: string): TransportationStatus {
    if (!data) return new this();
    let status = new this(data);
    return status;
  }

  constructor(public code?: string) {}

  get name(){
    switch (this.code) {
      case 'AGUARDANDO_ENTRADA':
        return 'Aguardando Entrada';
      case 'AUTORIZACAO_EFETUADA':
        return 'Autorização Efetuada';
      case 'SOLICITADO_ENTRADA':
        return 'Solicitado Entrada';
      case 'PROCESSO_CARGA_DESCARGA':
        return 'Processo Carga/Descarga';
      case 'AGUARDANDO_LIBERACAO':
        return 'Aguardando Liberação';
      case 'LIBERACAO_PERMITIDA':
        return 'Liberação Permitida';
      case 'FECHADO':
        return 'Fechado';
      default:
        return null;
    }
  }

  get color(){
    switch (this.code) {
      case 'AGUARDANDO_ENTRADA':
        return 'white';
      case 'AUTORIZACAO_EFETUADA':
        return '#FFD5AA';
      case 'SOLICITADO_ENTRADA':
        return '#FFFF80';
      case 'PROCESSO_CARGA_DESCARGA':
        return '#80FFFF';
      case 'AGUARDANDO_LIBERACAO':
        return '#02B029';
      case 'LIBERACAO_PERMITIDA':
        return '#00FF99';
      case 'FECHADO':
        return 'white';
      default:
        return null;
    }
  }

  equals(status: TransportationStatus) {
    if (!status) {
      return false;
    }

    return this.code === status.code;
  }

}
