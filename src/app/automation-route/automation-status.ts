export class AutomationStatus {

  static FREE = AutomationStatus.fromData('FREE');
  static EQUIPAMENT_IN_PROCESS = AutomationStatus.fromData('EQUIPAMENT_IN_PROCESS');
  static EQUIPAMENT_OCCUPIED = AutomationStatus.fromData('EQUIPAMENT_OCCUPIED');

  static list(): Array<AutomationStatus> {
    return [
      this.FREE,
      this.EQUIPAMENT_IN_PROCESS,
      this.EQUIPAMENT_OCCUPIED,
    ];
  }

  static fromData(data: string): AutomationStatus {
    if (!data) return new this();
    let status = new this(data);
    return status;
  }

  constructor(public code?: string) {}

  get name(){
    switch (this.code) {
      case 'FREE':
        return 'Equipamento Disponível';
      case 'EQUIPAMENT_IN_PROCESS':
        return 'Equipamento em Processo';
      case 'EQUIPAMENT_OCCUPIED':
        return 'Equipamento Ocupado';
      default:
        return null;
    }
  }

  get color(){
    switch (this.code) {
      case 'FREE':
        return '#e6e7e8';
      case 'EQUIPAMENT_OCCUPIED':
        return '#ec7f36';
      case 'EQUIPAMENT_IN_PROCESS':
        return '#9cb521';
      default:
        return null;
    }
  }

  equals(status: AutomationStatus) {
    if (!status) {
      return false;
    }

    return this.code === status.code;
  }

}
