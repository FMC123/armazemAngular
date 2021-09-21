export class IncidentSeverity {

  static HIGH = IncidentSeverity.fromData('HIGH');
  static MEDIUM = IncidentSeverity.fromData('MEDIUM');
  static LOW = IncidentSeverity.fromData('LOW');

  static list(): Array<IncidentSeverity> {
    return [
      this.HIGH,
      this.MEDIUM,
      this.LOW,
    ];
  }

  static fromListData(listData: Array<string>): Array<IncidentSeverity> {
    return listData.map(data => {
      return IncidentSeverity.fromData(data);
    });
  }

  static fromData(data: string): IncidentSeverity {
    if (!data) return new this();
    return new this(data);
  }

  static fromDataObject(data: IncidentSeverity): IncidentSeverity {
    if (!data) return new this();
    return new this(data.code);
  }

  constructor(public code?: string) {
  }

  get name() {
    switch (this.code) {
      case 'HIGH':
        return 'Alto';
      case 'MEDIUM':
        return 'Médio';
      case 'LOW':
        return 'Baixo';
    }
  }

}
