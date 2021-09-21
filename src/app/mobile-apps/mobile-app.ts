import { Endpoints } from 'app/endpoints';


export class MobileApp {

  static fromListData(listData: Array<MobileApp>): Array<MobileApp> {
    return listData.map((data) => {
      return MobileApp.fromData(data);
    });
  }

  static fromData(data: MobileApp): MobileApp {
    if (!data) {
      return new this();
    }
    let mobileApp = new this(
      data.id,
      data.filename,
      data.minWmsVersion,
      data.mobileAppVersion,
      `${Endpoints.mobileAppDownloadUrl}/${data.id}`,
      data.lastModified
    );
    return mobileApp;
  }

  constructor(
    public id?: string,
    public filename?: string,
    public minWmsVersion?: string,
    public mobileAppVersion?: string,
    public url?: string,
    public lastModified?: number
  ) { }

}
