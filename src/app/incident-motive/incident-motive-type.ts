export class IncidentMotiveType {
    static MOVE = IncidentMotiveType.fromData('MOVE');
    static GENERAL = IncidentMotiveType.fromData('GENERAL')
    static IN = IncidentMotiveType.fromData("IN");
    static SERVICE = IncidentMotiveType.fromData("SERVICE");
    static OUT = IncidentMotiveType.fromData("OUT");
    static MAINTENANCE = IncidentMotiveType.fromData("MAINTENANCE");


    static list(): Array<IncidentMotiveType> {
        return [this.MOVE, this.GENERAL, this.IN, this.SERVICE, this.OUT, this.MAINTENANCE];
    }

    static fromData(data: string): IncidentMotiveType {
        if (!data) return new this();
        let type = new this(data);
        return type;
    }

    constructor(public code?: string) { }

    get type() {
        switch (this.code) {
            case 'GENERAL':
                return 'Geral';
            case 'IN':
                return 'Entrada';
            case 'MOVE':
                return 'Movimentação';
            case 'SERVICE':
                return 'Serviço';
            case 'OUT':
                return 'Saída';
            case 'MAINTENANCE':
                return 'Manutenção';
            default:
                return null;
        }
    }
}
