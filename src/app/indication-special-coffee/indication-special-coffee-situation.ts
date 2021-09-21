export class IndicationSpecialCoffeeSituation {

    static INDICATED = IndicationSpecialCoffeeSituation.fromData('INDICATED');
    static UNDER_ANALYSIS = IndicationSpecialCoffeeSituation.fromData('UNDER_ANALYSIS');
    static CONFIRMED = IndicationSpecialCoffeeSituation.fromData('CONFIRMED');
    static NOT_CONFIRMED = IndicationSpecialCoffeeSituation.fromData('NOT_CONFIRMED');

    static list(): Array<IndicationSpecialCoffeeSituation> {
        return [
            this.INDICATED,
            this.UNDER_ANALYSIS,
            this.CONFIRMED,
            this.NOT_CONFIRMED,
        ];
    }

    static fromData(data: string): IndicationSpecialCoffeeSituation {
        if (!data) return new this();
        let status = new this(data);
        return status;
    }

    constructor(public code?: string) { }

    get name() {
        switch (this.code) {
            case 'INDICATED':
                return 'Indicado';
            case 'UNDER_ANALYSIS':
                return 'Em Análise';
            case 'CONFIRMED':
                return 'Confirmado';
            case 'NOT_CONFIRMED':
                return 'Não Confirmado';
            default:
                return null;
        }
    }

}
