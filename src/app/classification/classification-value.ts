export class ClassificationValue {
	static fromListData(
		listData: Array<ClassificationValue>
	): Array<ClassificationValue> {
		return listData.map(data => {
			return ClassificationValue.fromData(data);
		});
	}

	static fromData(data?: ClassificationValue): ClassificationValue {
		if (!data) {
			return new this();
		}

		const classificationValue = new this(data.id, data.value);
		return classificationValue;
	}

	constructor(public id?: string, public value?: string) {}
}
