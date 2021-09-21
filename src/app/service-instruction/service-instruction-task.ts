import { MarkupGroupBatch } from "app/markup-group/batch/markup-group-batch";
import { ExpectedResult } from "./expected-result";

export class ServiceInstructionTask {
  
  constructor(
    public taskOrder?: number,
    public taskBatches?: Array<MarkupGroupBatch>,
    public taskExpectedResults?: Array<ExpectedResult>,
  ) {
    this.taskBatches = taskBatches || new Array<MarkupGroupBatch>();
    this.taskExpectedResults = taskExpectedResults || new Array<ExpectedResult>();
  }

  static fromListData(
    listData: Array<ServiceInstructionTask>
  ): Array<ServiceInstructionTask> {
    return listData.map(data => {
      return ServiceInstructionTask.fromData(data);
    });
  }

  static fromData(data?: ServiceInstructionTask): ServiceInstructionTask {
    if (!data) {
      return new this();
    }

    let ServiceInstructionTask = new this(
      data.taskOrder,
      data.taskBatches,
      data.taskExpectedResults
    );

    return ServiceInstructionTask;
  }
  
}
