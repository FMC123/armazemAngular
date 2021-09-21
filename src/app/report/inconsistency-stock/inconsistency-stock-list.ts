import { Collaborator } from "../../collaborator/collaborator";

export class InconsistencyStockReportList {
    static fromListData(listData: Array<InconsistencyStockReportList>): Array<InconsistencyStockReportList> {
        return listData.map((data) => {
            return InconsistencyStockReportList.fromData(data);
        });
    }

    static fromData(data: InconsistencyStockReportList): InconsistencyStockReportList {
        if (!data) return new this();
        let inconsistency = new this(
            data.batchCode,
            data.personName,
            data.quantitySacks,
            data.sacks,
            data.averageWeightSack
        );
        return inconsistency;
    }

    constructor(
        public batchCode?: string,
        public personName?: string,
        public quantitySacks?: number,
        public sacks?: number,
        public averageWeightSack?: number,
    ) {

    }
}
