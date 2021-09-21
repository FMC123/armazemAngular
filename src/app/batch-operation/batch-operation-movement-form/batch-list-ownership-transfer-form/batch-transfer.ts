import { Batch } from "../../../batch/batch";
import { NumberHelper } from "../../../shared/globalization";

export class BatchTransfer {
	tempId: string;
	_selected: boolean;

	set selected(value) {
		this._selected = value;
	}

	get selected() {
		return this._selected;
	}

	static fromListData(listData: Array<BatchTransfer>): Array<BatchTransfer> {
		return listData.map(data => {
			return BatchTransfer.fromData(data);
		});
	}

	static fromData(data: BatchTransfer): BatchTransfer {
		if (!data) return new this();
		let batchTransfer = new this(
			data.id,
			data.batchOrigin,
			data.batchDestinyCode,
			data.quantityTransfer,
			data.quantityBags,
			data.calcManual,
      data.refClient
		);
		return batchTransfer;
	}

	constructor(
		public id?: string,
		public batchOrigin?: Batch,
		public batchDestinyCode?: string,
		public quantityTransfer?: number,
		public quantityBags?: number,
		public calcManual?: boolean,
    public refClient?: string
	) { }

	get quantityTransferString() {
		return NumberHelper.toPTBR(this.quantityTransfer);
	}

	get calcManualString() {
		return (this.calcManual) ? 'Sim' : 'Não';
	}
}
