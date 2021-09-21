export class SampleMovementType {
  static IN = SampleMovementType.fromData('IN');
  static WITHDRAW = SampleMovementType.fromData('WITHDRAW');
  static RETURN = SampleMovementType.fromData('RETURN');
  static CLOSED = SampleMovementType.fromData('CLOSED');
  static RESERVATION = SampleMovementType.fromData('RESERVATION');
  static SAMPLE_REQUEST = SampleMovementType.fromData('SAMPLE_REQUEST');
  static PICOTE_REQUEST = SampleMovementType.fromData('PICOTE_REQUEST');
  static PICOTE_ACCEPTED = SampleMovementType.fromData('PICOTE_ACCEPTED');
  static PICOTE_READYTOSHIP = SampleMovementType.fromData('PICOTE_READYTOSHIP');
  static PICOTE_SENT = SampleMovementType.fromData('PICOTE_SENT');
  static PICOTE_IN = SampleMovementType.fromData('PICOTE_IN');
  static SAMPLE_RECEIVED = SampleMovementType.fromData('SAMPLE_RECEIVED');

  static list(): Array<SampleMovementType> {
		return [this.IN,
            this.WITHDRAW,
            this.RETURN,
            this.RESERVATION,
            this.SAMPLE_REQUEST,
            this.PICOTE_REQUEST,
            this.CLOSED,
            this.PICOTE_ACCEPTED,
            this.PICOTE_READYTOSHIP,
            this.PICOTE_SENT,
            this.PICOTE_IN,
            this.SAMPLE_RECEIVED];
	}

	static fromData(data: string): SampleMovementType {
		if (!data) return new this();
		const status = new this(data);
		return status;
	}

	constructor(public code?: string) {}

	get name() {
		switch (this.code) {
      case 'IN':
        return 'Entrada';
      case 'WITHDRAW':
        return 'Retirada';
      case 'RESERVATION':
        return 'Reserva de amostra';
      case 'RETURN':
        return 'Devolução';
      case 'SAMPLE_REQUEST':
        return 'Solicitação de amostra';
      case 'SAMPLE_RECEIVED':
        return 'Amostra recebida pelo setor';
      case 'PICOTE_REQUEST':
        return 'Solicitação de picote';
      case 'PICOTE_ACCEPTED':
        return 'Picote aceito';
      case 'PICOTE_READYTOSHIP':
        return 'Picote pronto para envio';
      case 'PICOTE_SENT':
        return 'Picote enviado';
      case 'PICOTE_IN':
        return 'Picote recebido';
      case 'CLOSED':
        return 'Dado baixa';
      default:
        return null;
		}
	}

  get status() {
    switch (this.code) {
      case 'SAMPLE_REQUEST':
        return 'Aguardando Amostra';
      case 'WITHDRAW':
        return 'Amostra Enviada';
      case 'SAMPLE_RECEIVED':
        return 'Amostra recebida pelo setor';
      case 'RETURN':
        return 'Amostra Devolvida';
      default:
        return null;
    }
  }
}
