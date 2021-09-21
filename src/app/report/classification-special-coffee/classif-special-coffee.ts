import {TypeCoffee} from "../../pack-type/type-coffee";

export class ClassifSpecialCoffee {
    static fromListData(listData: Array<ClassifSpecialCoffee>): Array<ClassifSpecialCoffee> {
        return listData.map((data) => {
            return ClassifSpecialCoffee.fromData(data);
        });
    }

    static fromData(data: ClassifSpecialCoffee): ClassifSpecialCoffee {
        if (!data) return new this();
        let batch = new this(
            data.batchCode,
            data.collaboratorCode,
            data.collaboratorName,
            data.ownerCode,
            data.ownerName,
            data.sacks,
            data.quantity,
            data.entryDate,
            data.drink,
            data.observationSpecialCoffee,
            data.batchTypeCoffee,
            data.specialCoffeeSituation,
            data.pointing,
            data.strainer16,
            data.sampler,
            data.specialSampler,
            data.breaking,
            data.moistureContent,
        );
        return batch;
    }

    constructor(
        public batchCode?: string,
        public collaboratorCode?: string,
        public collaboratorName?: string,
        public ownerCode?: string,
        public ownerName?: string,
        public sacks?: number,
        public quantity?: number,
        public entryDate?: number,
        public drink?: string,
        public observationSpecialCoffee?: string,
        public batchTypeCoffee?: string,
        public specialCoffeeSituation?: string,
        public pointing?: string,
        public strainer16?: string,
        public sampler?: string,
        public specialSampler?: string,
        public breaking?: string,
        public moistureContent?: string,
    ) {
    }
}
