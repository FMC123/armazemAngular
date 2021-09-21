import { EquipamentTag } from '../equipament/equipament-tag/equipament-tag';
import { DateTimeHelper } from '../shared/globalization';
import { User } from './../user/user';

export class AutomationLog {

  static fromListData(listData: Array<AutomationLog>): Array<AutomationLog>{
    return listData.map((data) => {
      return AutomationLog.fromData(data);
    });
  }

  static fromData(data: AutomationLog): AutomationLog {
    if (!data) return new this();
    let automationLog = new this(
      data.id,
      data.code,
      data.equipamentTag,
      data.writeValue,
      data.logDate,
      data.createdBy,
    );
    return automationLog;
  }

  constructor(
    public id?: string,
    public code?: string,
    public equipamentTag?: EquipamentTag,
    public writeValue?: string,
    public logDate?: number,
    public createdBy?: User,
  ) {
    if (createdBy) {
      this.createdBy = User.fromData(createdBy);
    }

    if (equipamentTag) {
      this.equipamentTag = EquipamentTag.fromData(equipamentTag);
    }
  }

  get logDateString(): string{
    return DateTimeHelper.toDDMMYYYYHHmm(this.logDate);
  }
  set logDateString(logDateString: string){
    this.logDate = DateTimeHelper.fromDDMMYYYYHHmm(logDateString);
  }

}
