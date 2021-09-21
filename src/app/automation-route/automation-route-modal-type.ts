export class AutomationTypeModal {

  static RECEIVING = AutomationTypeModal.fromData('RECEIVING');
  static BAGGING = AutomationTypeModal.fromData('BAGGING');
  static DUMPING = AutomationTypeModal.fromData('DUMPING');

  static list(): Array<AutomationTypeModal> {
    return [
      this.RECEIVING,
      this.BAGGING,
    ];
  }

  static fromListData(listData: Array<string>): Array<AutomationTypeModal> {
    return listData.map((data) => {
      return AutomationTypeModal.fromData(data);
    });
  }

  static fromData(data: string): AutomationTypeModal {
    if (!data) return new this();
    let status = new this(data);
    return status;
  }

  static fromDataObject(data: AutomationTypeModal): AutomationTypeModal {
    if (!data) return new this();
    let automationTypeModal = new this();
    return automationTypeModal;
  }

  constructor(public code?: string) { }

  get name() {
    switch (this.code) {
      case 'RECEIVING':
        return 'Recebimento';
      case 'BAGGING':
        return 'Embegamento';
      case 'DUMPING':
        return 'Despejando';
      default:
        return null;
    }
  }
}
