import {MarkupGroup} from "../markup-group";
import {Sample} from "../../sample/sample";

export class MarkupGroupSample {

  static fromListData(listData: Array<MarkupGroupSample>): Array<MarkupGroupSample> {
    return listData.map((data) => {
      return MarkupGroupSample.fromData(data);
    });
  }

  static fromData(data: any): MarkupGroupSample {
    if (!data) return new this();
    let markupGroupSample = new this(
      data.id,
      data.markupGroup,
      data.sample,
      data.quantity
    );
    return markupGroupSample;
  }

  constructor(
    public id?: string,
    public markupGroup?: MarkupGroup,
    public sample?: Sample,
    public quantity?: number,
  ) {
    if (markupGroup) {
      this.markupGroup = MarkupGroup.fromData(markupGroup);
    }

    if (sample) {
      this.sample = Sample.fromData(sample);
    }

  }

}
