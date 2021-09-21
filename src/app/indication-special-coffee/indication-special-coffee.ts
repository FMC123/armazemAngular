import { Address } from '../address/address';

import { DateTimeHelper } from '../shared/globalization/date-time-helper';
import { Sample } from '../sample/sample';
import { Batch } from '../batch/batch';
import { IndicationSpecialCoffeeChannel } from './indication-special-coffee-channel';
import { IndicationSpecialCoffeeSituation } from './indication-special-coffee-situation';

export class IndicationSpecialCoffee {

    static fromListData(listData: Array<IndicationSpecialCoffee>): Array<IndicationSpecialCoffee> {
        return listData.map((data) => {
            return IndicationSpecialCoffee.fromData(data);
        });
    }

    static fromData(data: IndicationSpecialCoffee): IndicationSpecialCoffee {
        if (!data) return new this();
        let indicationSpecialCoffee = new this(
            data.id,
            data.sample,
            data.batchCode,
            data.quantity,
            data.classZimPadraoCafe,
            data.dateIndication,
            data.indicationSpecialCoffeeChannel,
            data.indicationSpecialCoffeeSituation,
        );
        return indicationSpecialCoffee;
    }

    constructor(
        public id?: string,
        public sample?: Sample,
        public batchCode?: String,
        public quantity?: Number,
        public classZimPadraoCafe?: String,
        public dateIndication?: number,
        public indicationSpecialCoffeeChannel?: string,
        public indicationSpecialCoffeeSituation?: string
    ) { }

    get getCollaborator() {
        if (!this.sample) {
            return;
        }
        if (!this.sample.batches || !this.sample.batches.length) {
            return;
        }
        if (!this.sample.batches[0].batchOperation) {
            return;
        }
        if (!this.sample.batches[0].batchOperation.owner) {
            return;
        }
        if (!this.sample.batches[0].batchOperation.owner.person) {
            return;
        }
        return this.sample.batches[0].batchOperation.owner.person.name;
    }

    get getBatchCode() {
        let batchCodeContat = '';
        if (!this.sample) {
            return;
        }
        if (!this.sample.batches || !this.sample.batches.length) {
            return;
        }
        if (this.sample.batches.length === 1) {
            return this.sample.batches[0].batchCode;
        }
        this.sample.batches.forEach(batch => {
            batchCodeContat = batchCodeContat + batch.batchCode + '/';
        })
        return batchCodeContat;
    }

    get getQuantitySacks() {
        if (this.batchesCount <= 0) {
            return;
        }
        return this.sample.batches.map((b) => b.balance)
            .reduce((a, b) => {
                return Number(a) + Number(b);
            }, 0);
    }

    get batchesCount(): number {
        if (!this.sample || !this.sample.batches || !this.sample.batches.length) {
            return 0;
        }
        return this.sample.batches.length;
    }

    get indicationSpecialCoffeeDateString(): string {
        return DateTimeHelper.toDDMMYYYYHHmm(this.dateIndication);
    }

    set indicationDateString(classificationDateString: string) {
        this.dateIndication = DateTimeHelper.fromDDMMYYYYHHmm(
            classificationDateString
        );
    }

    get channel(): string {
        if (!this.indicationSpecialCoffeeChannel) {
            return '';
        }
        let channel = IndicationSpecialCoffeeChannel.fromData(this.indicationSpecialCoffeeChannel);
        if (channel) {
            return channel.name;
        }
        return '';
    }

    get situation(): string {
        if (!this.indicationSpecialCoffeeSituation) {
            return;
        }
        let situation = IndicationSpecialCoffeeSituation.fromData(this.indicationSpecialCoffeeSituation);
        if (situation) {
            return situation.name;
        }
        return '';
    }

}

