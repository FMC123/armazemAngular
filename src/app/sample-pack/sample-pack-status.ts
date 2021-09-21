export class SamplePackStatus {
	static QUEUED = SamplePackStatus.fromData('QUEUED');
	static SENT = SamplePackStatus.fromData('SENT');
	static RECEIVED = SamplePackStatus.fromData('RECEIVED');
	static RECEIVED_NOT_ACCORDANCE = SamplePackStatus.fromData('RECEIVED_NOT_ACCORDANCE');

	static list(): Array<SamplePackStatus> {
		return [this.QUEUED, this.SENT, this.RECEIVED, this.RECEIVED_NOT_ACCORDANCE];
	}

	static fromData(data: string): SamplePackStatus {
		if (!data) return new this();
		let status = new this(data);
		return status;
	}

	constructor(public code?: string) {}

	get name() {
		switch (this.code) {
			case 'QUEUED':
				return 'Aguardando envio';
			case 'SENT':
				return 'Enviado';
			case 'RECEIVED':
				return 'Recebido conforme';
			case 'RECEIVED_NOT_ACCORDANCE':
				return 'Recebido não conforme';
			default:
				return null;
		}
	}
}
