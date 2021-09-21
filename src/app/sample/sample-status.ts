/**
 * Situações para as amostras
 */
export class SampleStatus {

	public static CREATED = SampleStatus.fromData('CREATED');
	public static STORED = SampleStatus.fromData('STORED');
	public static RESERVED = SampleStatus.fromData('RESERVED');
	public static WITHDRAWN = SampleStatus.fromData('WITHDRAWN');
	public static CLOSED = SampleStatus.fromData('CLOSED');

	public static list(): Array<SampleStatus> {
		return [this.CREATED, this.STORED, this.RESERVED, this.WITHDRAWN, this.CLOSED];
	}

	public static fromData(data: string): SampleStatus {
		if (!data) return new this();
		const status = new this(data);
		return status;
	}

	constructor(public code?: string) { }

	public get name() {
		switch (this.code) {
			case 'CREATED':
				return 'Criado';
			case 'STORED':
				return 'Armazenado';
			case 'RESERVED':
				return 'Reservado';
			case 'WITHDRAWN':
				return 'Retirado';
			case 'CLOSED':
				return 'Baixado';
			default:
				return '';
		}
	}
}