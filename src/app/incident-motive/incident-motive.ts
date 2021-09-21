export class IncidentMotive {

    static fromListData(listData: Array<IncidentMotive>): Array<IncidentMotive> {
        return listData.map((data) => {
            return IncidentMotive.fromData(data);
        });
    }

    static fromData(data: IncidentMotive): IncidentMotive {
        if (!data) return new this();

        let incidentMotive = new this(
            data.id,
            data.code,
            data.description,
            data.type

        );

        return incidentMotive;
    }

    constructor(
        public id?: string,
        public code?: number,
        public description?: string,
        public type?: string
    ) { }

}
