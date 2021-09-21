export class IncidentOrigin {

  static PORTAL = IncidentOrigin.fromData('PORTAL');
  static PORTICO = IncidentOrigin.fromData('PORTICO');
  static FORKLIFT = IncidentOrigin.fromData('FORKLIFT');
  static SCALE = IncidentOrigin.fromData('SCALE');
  static INVENTORY = IncidentOrigin.fromData('INVENTORY');
  static LOBBY = IncidentOrigin.fromData('LOBBY');

  static list(): Array<IncidentOrigin> {
    return [
      this.PORTAL,
      this.PORTICO,
      this.FORKLIFT,
      this.SCALE,
      this.INVENTORY,
      this.LOBBY,
    ];
  }

  static fromListData(listData: Array<string>): Array<IncidentOrigin> {
    return listData.map(data => {
      return IncidentOrigin.fromData(data);
    });
  }

  static fromData(data: string): IncidentOrigin {
    if (!data) return new this();
    return new this(data);
  }

  static fromDataObject(data: IncidentOrigin): IncidentOrigin {
    if (!data) return new this();
    return new this(data.code);
  }

  constructor(public code?: string) {

  }

  get name() {
    switch(this.code){
      case 'PORTAL':
        return 'Portal Automático';
      case 'PORTICO':
        return 'Pórtico';
      case 'FORKLIFT':
        return 'Empilhadeira';
      case 'SCALE':
        return 'Balança';
      case 'INVENTORY':
        return 'Inventário';
      case 'LOBBY':
        return 'Portaria';
    }
    return null;
  }

}
