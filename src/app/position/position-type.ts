export class PositionType {
	static GRANEL = PositionType.fromData('G');
	static MOEGA = PositionType.fromData('M');
	static BALANCA = PositionType.fromData('B');
	static SILO = PositionType.fromData('S');
	static EMBEGADORA = PositionType.fromData('E');
	static PORTAO = PositionType.fromData('P');
	static ALA = PositionType.fromData('A');
	static ARMAZENAMENTO_SILO = PositionType.fromData('SS');
	static SACARIA = PositionType.fromData('SC');
		static DESCRITIVO = PositionType.fromData('DC');

	static list(): Array<PositionType> {
		return [
			this.GRANEL,
			this.MOEGA,
			this.BALANCA,
			this.SILO,
			this.EMBEGADORA,
			this.PORTAO,
			this.ALA,
			this.SACARIA,
			this.ARMAZENAMENTO_SILO,
      this.DESCRITIVO,
		];
	}

	static fromListData(listData: Array<string>): Array<PositionType> {
		return listData.map(data => {
			return PositionType.fromData(data);
		});
	}

	static fromData(data: string): PositionType {
		if (!data) return new this();
		let status = new this(data);
		return status;
	}

	constructor(public code?: string) {}

	get shape() {
		if (['G', 'S', 'SS'].indexOf(this.code) > -1) {
			return 'circle';
		}
		return 'rect';
	}

	get name() {
		switch (this.code) {
			case 'G':
				return 'Granel';
			case 'E':
				return 'Embegadora';
			case 'M':
				return 'Moega';
			case 'B':
				return 'Balança Embegadora';
			case 'S':
				return 'Silo';
			case 'P':
				return 'Portão de Entrada';
			case 'A':
				return 'Ala';
			case 'SC':
				return 'Pilha de Sacaria';
			case 'SS':
				return 'Silo de Armazenamento';
			case 'DC':
        return 'Descritivo';
			default:
				return null;
		}
	}
}
