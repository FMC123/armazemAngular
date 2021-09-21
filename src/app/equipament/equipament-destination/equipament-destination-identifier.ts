export class EquipamentDestinationIdentifier {

  static UNICO = EquipamentDestinationIdentifier.fromData("UNICO");
  static ESQUERDA = EquipamentDestinationIdentifier.fromData("ESQUERDA");
  static CENTRO = EquipamentDestinationIdentifier.fromData("CENTRO");
  static DIREITA = EquipamentDestinationIdentifier.fromData("DIREITA");


  static list(): Array<EquipamentDestinationIdentifier> {
    return [
      this.UNICO,
      this.ESQUERDA,
      this.CENTRO,
      this.DIREITA,
    ];
  }

  static fromData(data: string): EquipamentDestinationIdentifier {
    if (!data) return new this();
    let identifier = new this(data);
    return identifier;
  }

  constructor(public code?: string) {}

  get name(){
    switch (this.code) {
      case 'UNICO':
        return 'Único';
      case 'ESQUERDA':
        return 'Esquerda';
      case 'CENTRO':
        return 'Centro';
      case 'DIREITA':
        return 'Direita';
      default:
        return null;
    }
  }


}
