export class IntegrationLogStatus {
	static SUCCESS = IntegrationLogStatus.fromData('SUCCESS');
	static ERROR = IntegrationLogStatus.fromData('ERROR');
	

	static list(): Array<IntegrationLogStatus> {
		return [this.SUCCESS, this.ERROR];
	}

	static fromData(data: string): IntegrationLogStatus {
		if (!data) return new this();
		let status = new this(data);
		return status;
	}

	constructor(public code?: string) {}

	get name() {
		switch (this.code) {
			case 'SUCCESS':
				return 'Sucesso';
			case 'ERROR':
				return 'Erro';
			
			default:
				return null;
		}
	}
}
