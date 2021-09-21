
export class PurchaseOrderTotal {

	static fromData(data: any): PurchaseOrderTotal {

		if (!data) return new this();

		let purchaseOrderTotal = new this(
			data.totalQuantity,
			data.totalDischarged,
			data.totalForDischarging
		);

		return purchaseOrderTotal;
	}

	constructor(
		public totalQuantity?: number,
		public totalDischarged?: number,
		public totalForDischarging?: number
	) {
	}
}