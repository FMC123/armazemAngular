export class SampleMotive {
	static CLASSIFICATION = SampleMotive.fromData('CLASSIFICATION');
	static REINFORCEMENT = SampleMotive.fromData('REINFORCEMENT');
	static RECLASSIFICATION = SampleMotive.fromData('RECLASSIFICATION');

	static list(): Array<SampleMotive> {
		return [this.CLASSIFICATION, this.REINFORCEMENT, this.RECLASSIFICATION];
	}

	static fromData(data: string): SampleMotive {
		if (!data) return new this();
		const status = new this(data);
		return status;
	}

	constructor(public code?: string) {}

	get name() {
		switch (this.code) {
			case 'CLASSIFICATION':
				return 'Classificação';
			case 'REINFORCEMENT':
				return 'Reforço de Amostra';
			case 'RECLASSIFICATION':
				return 'Reclassificação';
			default:
				return null;
		}
	}
}
