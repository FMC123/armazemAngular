import { Collaborator } from "../../collaborator/collaborator";
import { InconsistencyStockReportList } from "./inconsistency-stock-list";

export class InconsistencyStock {
  static fromListData(listData: Array<InconsistencyStock>): Array<InconsistencyStock> {
    return listData.map((data) => {
      return InconsistencyStock.fromData(data);
    });
  }

  static fromData(data: InconsistencyStock): InconsistencyStock {
    if (!data) return new this();
    let inconsistency = new this(
      data.batchCode,
      data.collaborator,
      data.registration,
      data.personName,
      data.listInconsistency
    );
    return inconsistency;
  }

  constructor(
    public batchCode?: string,
    public collaborator?: Collaborator,
    public registration?: string,
    public personName?: string,
    public listInconsistency?: Array<InconsistencyStockReportList>

  ) {
    if (listInconsistency) {
      this.listInconsistency = InconsistencyStockReportList.fromListData(listInconsistency);
    }
  }
}
