export class IntegrationLogDirection {
	static IN = IntegrationLogDirection.fromData('IN');
	static OUT = IntegrationLogDirection.fromData('OUT');
	

	static list(): Array<IntegrationLogDirection> {
		return [this.IN, this.OUT];
	}

	static fromData(data: string): IntegrationLogDirection {
		if (!data) return new this();
		let status = new this(data);
		return status;
	}

	constructor(public code?: string) {}

	get name() {
		switch (this.code) {
			case 'IN':
				return 'IN';
			case 'OUT':
				return 'OUT';
			
			default:
				return null;
		}
	}
}
