export class IntegrationLogIntegrationType {
	static UNKNOWN = IntegrationLogIntegrationType.fromData('UNKNOWN ');
    static INTERNAL = IntegrationLogIntegrationType.fromData('INTERNAL ');
    static AX = IntegrationLogIntegrationType.fromData('AX ');
    static ZIM = IntegrationLogIntegrationType.fromData('ZIM ');
    static PROCAFE = IntegrationLogIntegrationType.fromData('PROCAFE ');
    static TP = IntegrationLogIntegrationType.fromData('TP ');
    static SAP = IntegrationLogIntegrationType.fromData('SAP ');
    static TOTVS_LIV = IntegrationLogIntegrationType.fromData('TOTVS_LIV ');
    static TOTVS_EXPOCACCER = IntegrationLogIntegrationType.fromData('TOTVS_EXPOCACCER ');
	

	static list(): Array<IntegrationLogIntegrationType> {
		return [this.UNKNOWN, this.INTERNAL, this.AX, this.ZIM, this.PROCAFE, this.TP, this.SAP, this.TOTVS_LIV, this.TOTVS_EXPOCACCER];
	}

	static fromData(data: string): IntegrationLogIntegrationType {
		if (!data) return new this();
		let status = new this(data);
		return status;
	}

	constructor(public code?: string) {}

	// get name() {
	// 	switch (this.code) {
	// 		case 'SUCCESS':
	// 			return 'Sucesso';			
	// 		default:
	// 			return null;
	// 	}
	// }
}
