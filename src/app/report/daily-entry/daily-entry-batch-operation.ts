import { DailyEntry } from "./daily-entry";

export class DailyEntryBatchOperation {
    static fromListData(listData: Array<DailyEntryBatchOperation>): Array<DailyEntryBatchOperation> {
        return listData.map((data) => {
            return DailyEntryBatchOperation.fromData(data);
        });
    }

    static fromData(data: DailyEntryBatchOperation): DailyEntryBatchOperation {
        if (!data) return new this();
        let batch = new this(
            data.createdDate,
            data.quantitySacks,
            data.nameCollaborator,
            data.listDailyEntry,
            data.batchOperationCode,
        );
        return batch;
    }

    constructor(
        public createdDate?: string,
        public quantitySacks?: number,
        public nameCollaborator?: string,
        public listDailyEntry?: Array<DailyEntry>,
        public batchOperationCode?: string,

    ) {
        if (listDailyEntry) {
            listDailyEntry = DailyEntry.fromListData(listDailyEntry);
        }
    }
}
