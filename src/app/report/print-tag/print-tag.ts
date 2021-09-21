import { Collaborator } from "../../collaborator/collaborator";

export class PrintTag {
  static fromListData(listData: Array<PrintTag>): Array<PrintTag> {
    return listData.map((data) => {
      return PrintTag.fromData(data);
    });
  }

  static fromData(data: PrintTag): PrintTag {
    if (!data) return new this();
    let printTag = new this(
      data.tagStarted,
      data.quantity,
      data.certificateId
    );
    return printTag;
  }

  constructor(
    public tagStarted?: number,
    public quantity?: number,
    public certificateId?: string,
    ) {}
  }
