
export class Certificate {

  static fromListData(listData: Array<Certificate>): Array<Certificate> {
    return listData.map((data) => {
      return Certificate.fromData(data);
    });
  }

  static fromData(data: Certificate): Certificate {
    if (!data) return new this();
    let certificate = new this(
      data.id,
      data.code,
      data.name,
      data.filename,
      data.url,
      data.lastModified,
      data.procafeCode,
      data.fileBytes
    );
    return certificate;
  }

  constructor(
    public id?: string,
    public code?: string,
    public name?: string,
    public filename?: string,
    public url?: string,
    public lastModified?: number,
    public procafeCode?: string,
    public fileBytes?: string
  ) { }
}
