import { ClassificationValue } from './classification-value';
import { ClassificationTypeGroup } from './classification-type-group';

export class ClassificationType {

  public static ENUMERATOR = 'ENUMERATOR';
  public static INTERVAL = 'INTERVAL';
  public static STRING = 'STRING';

	static fromListData(listData: Array<ClassificationType>): Array<ClassificationType> {
		return listData.map(data => {
			return ClassificationType.fromData(data);
		});
	}

	static fromData(data: ClassificationType): ClassificationType {
		if (!data) return new this();
		let classificationType = new this(
			data.id,
			data.name,
			data.type,
			data.min,
			data.max,
			data.scale,
			data.values,
			data.requiredNormal,
			data.orderNormal,
			data.requiredSpecialCoffee,
			data.orderSpecialCoffee,
			data.specialCoffeeItem,
			data.showOnReport,
			data.showOnMapFilter,
			data.internalCode,
			data.classificationTypeGroup
		);
		return classificationType;
	}

	constructor(
		public id?: string,
		public name?: string,
		public type?: string,
		public min?: number,
		public max?: number,
		public scale?: number,
		public values?: Array<ClassificationValue>,
		public requiredNormal?: Boolean,
		public orderNormal?: number,
		public requiredSpecialCoffee?: Boolean,
		public orderSpecialCoffee?: number,
		public specialCoffeeItem?: Boolean,
    	public showOnReport?: Boolean,
    	public showOnMapFilter?: Boolean,
		public internalCode?: string,
		public classificationTypeGroup?: ClassificationTypeGroup
	) {
		if (values) {
			this.values = ClassificationValue.fromListData(values);
		}
		
		if (classificationTypeGroup) {
			this.classificationTypeGroup = ClassificationTypeGroup.fromData(classificationTypeGroup);
		}
	}

	get requiredNormalString(): string {
		return this.requiredNormal ? 'Sim' : 'Não';
	}

	get requiredSpecialCoffeeString(): string {
		return this.requiredSpecialCoffee ? 'Sim' : 'Não';
	}

	get requiredString(): string {
		return ((this.requiredNormal != null && this.requiredNormal === true)
			|| (this.requiredSpecialCoffee != null && this.requiredSpecialCoffee === true))
			? 'Sim'
			: 'Não';
	}
}
