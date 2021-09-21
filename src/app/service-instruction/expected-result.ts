import { DateTimeHelper } from '../shared/globalization';
import { Strainer } from '../strainer/strainer';
import { User } from '../user/user';
import { Batch } from '../batch/batch';
export class ExpectedResult {

  static fromListData(
    listData: Array<ExpectedResult>
  ): Array<ExpectedResult> {
    return listData.map(data => {
      return ExpectedResult.fromData(data);
    });
  }

  static fromData(data?: ExpectedResult): ExpectedResult {
    if (!data) {
      return new this();
    }

    let expectedResult = new this(
      data.id,
      data.createdDate,
      data.strainer,
      data.percentage,
      data.quantity,
      data.totalSacksQuantity,
      data.observation,
      data.user,
      data.quantitySacks,
      data.createBatchWhenConfirm,
      data.batchResult,
      data.taskOrder,
      data.createdResultBatch
    );

    return expectedResult;
  }

  constructor(
    public id?: string,
    public createdDate?: number,
    public strainer?: Strainer,
    public percentage?: number,
    public quantity?: number,
    public totalSacksQuantity?: number,
    public observation?: string,
    public user?: User,
    public quantitySacks?: number,
    public createBatchWhenConfirm?: boolean,
    public batchResult?: string,
	public taskOrder?: number,
	public createdResultBatch?: Batch,
  ) {
    if (strainer) {
      this.strainer = Strainer.fromData(strainer);
    }
  }

  get createdDateString(): string {
    return DateTimeHelper.toDDMMYYYY(this.createdDate);
  }

  set createdDateString(createdDateString: string) {
    this.createdDate = DateTimeHelper.fromDDMMYYYY(createdDateString);
  }

  get batchResultString(): string {
    let str = '-';
    if(this.createBatchWhenConfirm && (!this.batchResult || this.batchResult == ""))
    {
      str = 'Gerar automaticamente';
    }
    else if(this.createBatchWhenConfirm && this.batchResult && this.batchResult != "")
    {
      str = this.batchResult;
    }

    return str;
  }
}
