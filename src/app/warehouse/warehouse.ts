import { Person } from '../person/person';
import { NumberHelper } from '../shared/globalization';

export class Warehouse {
	public parent?: Warehouse;
	public children?: Array<Warehouse>;

	static fromListData(listData: Array<any>): Array<Warehouse> {
		return listData.map(data => {
      return Warehouse.fromData(data);
		});
	}

	static fromData(data: any, options: any = {}): Warehouse {
		if (!data) {
			return new this();
		}

		let warehouse = new this(
			data.id,
			data.name,
			data.code,
			data.shortName,
			data.procafeCode,
			data.axCode,
			data.parent,
			data.children,
			data.stackWeightLimit,
			Person.fromData(data.person),
			data.storageTypeBigBag,
			data.storageTypeSacaria,
			data.storageTypeSilo,
			data.matriz,
      data.ipAddress,
      data.local
		);
    return warehouse;
	}

	constructor(
		public id?: string,
		public name?: string,
		public code?: string,
		public shortName?: string,
		public procafeCode?: string,
		public axCode?: string,
		parent?: Warehouse,
		children?: Array<Warehouse>,
		public stackWeightLimit?: number,
		public person?: Person,
		public storageTypeBigBag?: boolean,
		public storageTypeSacaria?: boolean,
		public storageTypeSilo?: boolean,
		public matriz?: boolean,
    public ipAddress?: string,
    public local?: boolean
	) {
		if (parent) {
			this.parent = Warehouse.fromData(parent);
		}

		if (children) {
			this.children = Warehouse.fromListData(children);
		}
	}

	get stackWeightLimitString(): string {
		return NumberHelper.toPTBR(this.stackWeightLimit);
	}

	set stackWeightLimitString(stackWeightLimitString: string) {
		this.stackWeightLimit = NumberHelper.fromPTBR(stackWeightLimitString);
	}

  get label() {

    if (!this.name) {
      return null;
    }

    let retorno = this.name;

    if (this.person.documentFormat) {
      retorno += ' - ' + this.person.documentFormat;
    }

    return retorno;
  }
}
