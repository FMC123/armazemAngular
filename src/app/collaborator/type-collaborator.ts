export class collaboratorType {

  static COOPERATED = collaboratorType.fromData('COOPERATED');
  static COLLABORATOR = collaboratorType.fromData('COLLABORATOR');

  static fromListData(listData: Array<string>): Array<collaboratorType> {
    return listData.map((data) => {
      return collaboratorType.fromData(data);
    });
  }

  static fromData(data: string): collaboratorType {
    if (!data) return new this();
    let type = new this(data);
    return type;
  }

  static fromDataObject(data: collaboratorType): collaboratorType {
    if (!data) return new this();
    let city = new this();
    return city;
  }

  constructor(public code?: string) { }

  get name() {
    switch (this.code) {
      case 'COOPERATED':
        return 'Cooperado';
      case 'COLLABORATOR':
        return 'Colaborador';
      default:
        return null;
    }
  }

}
