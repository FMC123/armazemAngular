export class Department {
	static fromListData(listData: Array<Department>): Array<Department> {
		return listData.map(data => {
			return Department.fromData(data);
		});
	}

	static fromData(data: Department): Department {
		if (!data) return new this();
		const parameter = new this(data.id, data.name);

		return parameter;
	}

	constructor(public id?: string, public name?: string) {}
}
