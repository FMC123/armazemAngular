import { DateTimeHelper, NumberHelper } from '../shared/globalization';
import { Warehouse } from '../warehouse/warehouse';
import { User } from '../user/user';
import { Forklift } from '../forklift/forklift';

export class AccessToken {

  static fromListData(listData: Array<AccessToken>): Array<AccessToken> {
    return listData.map((data) => {
      return AccessToken.fromData(data);
    });
  }


  static fromData(data: AccessToken): AccessToken {
    if (!data) return new this();
    let accessToken = new this(
      data.id,
      data.user,
      data.warehouse,
      data.remoteAddress,
      data.deviceId,
      data.expires,
      data.createdDate,
      data.deletedDate,
      data.leader,
      data.admin,
      data.forklift,
    );
    return accessToken;
  }

  constructor(
    public id?: string,
    public user?: User,
    public warehouse?: Warehouse,
    public remoteAddress?: string,
    public deviceId?: string,
    public expires?: number,
    public createdDate?: number,
    public deletedDate?: number,
    public leader?: boolean,
    public admin?: boolean,
    public forklift?: Forklift,
  ) {
    if (forklift) {
      this.forklift = Forklift.fromData(forklift);
    }
  }

  get expiresString(): string {
    return DateTimeHelper.toDDMMYYYYHHmm(this.expires);
  }
  set expiresString(expiresString: string) {
    this.expires = DateTimeHelper.fromDDMMYYYYHHmm(expiresString);
  }
  get createdDateString(): string {
    return DateTimeHelper.toDDMMYYYYHHmm(this.createdDate);
  }
  set createdDateString(createdDateString: string) {
    this.createdDate = DateTimeHelper.fromDDMMYYYYHHmm(createdDateString);
  }
  get deletedDateString(): string {
    return DateTimeHelper.toDDMMYYYYHHmm(this.deletedDate);
  }
  set deletedDateString(deletedDateString: string) {
    this.deletedDate = DateTimeHelper.fromDDMMYYYYHHmm(deletedDateString);
  }
}
