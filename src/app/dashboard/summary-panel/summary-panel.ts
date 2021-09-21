import {DateTimeHelper, NumberHelper} from '../../shared/globalization';

export class SummaryPanel {
  static fromListData(listData: Array<SummaryPanel>): Array<SummaryPanel> {
    return listData.map(data => {
      return SummaryPanel.fromData(data);
    });
  }

  static fromData(data: SummaryPanel): SummaryPanel {
    if (!data) return new this();
    let summaryPanel = new this(
      data.referenceDate,
      data.expectedEntries,
      data.expectedEntriesSacks,
      data.unloadingEntries,
      data.unloadingEntriesSacks,
      data.unloadedEntries,
      data.unloadedEntriesSacks
    );
    return summaryPanel;
  }

  constructor(
    public referenceDate?: number,
    public expectedEntries?: number,
    public expectedEntriesSacks?: number,
    public unloadingEntries?: number,
    public unloadingEntriesSacks?: number,
    public unloadedEntries?: number,
    public unloadedEntriesSacks?: number
  ) {}

  get referenceDateString(): string {
    return DateTimeHelper.toDDMMYYYY(this.referenceDate);
  }

  get balance(): number {
    return this.expectedEntries - this.unloadingEntries - this.unloadedEntries;
  }

  get balanceSacks(): number {
    return this.expectedEntriesSacks - this.unloadingEntriesSacks - this.unloadedEntriesSacks;
  }

}
