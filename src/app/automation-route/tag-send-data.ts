import { Position } from './../position/position';
import { RouteItemStatus } from './route-item-status';
import { EquipamentTag } from './../equipament/equipament-tag/equipament-tag';
import { Warehouse } from './../warehouse/warehouse';
import { DateTimeHelper } from '../shared/globalization';
import { NumberHelper } from '../shared/globalization';
import { User } from '../user/user';
import {Scale} from "../scale/scale";

export class TagSendData {

  static fromListData(listData: Array<TagSendData>): Array<TagSendData> {
    return listData.map((data) => {
      return TagSendData.fromData(data);
    });
  }

  static fromData(data: TagSendData): TagSendData {
    if (!data) return new this();
    let batch = new this(
      data.equipTagId,
      data.value,
      data.delayInMilisToAct,

    );
    return batch;
  }

  constructor(
    public equipTagId?:string,
    public value?: string,
    public delayInMilisToAct?: number,
  ) {}

}
