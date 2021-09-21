export class IncidentType {

  static MID = IncidentType.fromData('MID');
  static MIE = IncidentType.fromData('MIE');
  static DIA = IncidentType.fromData('DIA');

  static list(): Array<IncidentType> {
    return [
      this.MID,
      this.MIE,
      this.DIA,
    ];
  }

  static fromListData(listData: Array<string>): Array<IncidentType> {
    return listData.map(data => {
      return IncidentType.fromData(data);
    });
  }

  static fromData(data: string): IncidentType {
    if (!data) return new this();
    return new this(data);
  }

  static fromDataObject(data: IncidentType): IncidentType {
    if (!data) return new this();
    return new this(data.code);
  }

  constructor(public code?: string) {
  }

  get name() {
    switch (this.code) {
      case 'MID':
        return 'Movimentação Indevida Despejo';
      case 'MIE':
        return 'Movimentação Indevida Embarque';
      case "DIA":
        return 'Ação Indevida de Motorista';
    }
  }


}
