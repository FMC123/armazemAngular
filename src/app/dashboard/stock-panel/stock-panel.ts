import { NumberHelper } from '../../shared/globalization';

export class StockPanel {
	static fromListData(listData: Array<StockPanel>): Array<StockPanel> {
		return listData.map(data => {
			return StockPanel.fromData(data);
		});
	}

	static fromData(data: StockPanel): StockPanel {
		if (!data) return new this();
		let stockPanel = new this(
			data.totalSacks,
			data.totalKilos,
			data.totalBigBag
		);
		return stockPanel;
	}

	constructor(
		public totalSacks?: number,
		public totalKilos?: number,
		public totalBigBag?: number
	) {}

	get totalKilosString() {
		return NumberHelper.toPTBR(this.totalKilos);
	}

	get totalSacksTruncated() {
		return Math.ceil(this.totalSacks);
	}
}
