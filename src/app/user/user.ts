import { Company } from '../company/company';
import { Warehouse } from '../warehouse/warehouse';
import { Department } from '../department/department';

export class User {
	public warehouse?: Warehouse;

	static fromListData(listData: Array<User>): Array<User> {
		return listData.map(data => {
			return User.fromData(data);
		});
	}

	static fromDataAny(data: any) {
		if (!data) return new this();
		let user = new this(
			data.id,
			data.name,
			data.login,
			data.password,
			data.token,
			data.system,
			data.company,
			data.department,
			data.isClassifier,
			data.internalCode
		);
		return user;
	}

	static fromData(data: User): User {
		if (!data) return new this();
		let user = new this(
			data.id,
			data.name,
			data.login,
			data.password,
			data.token,
			data.system,
			data.company,
			data.department,
			data.isClassifier,
			data.internalCode
		);
		return user;
	}

	constructor(
		public id?: string,
		public name?: string,
		public login?: string,
		public password?: string,
		public token?: string,
		public system?: boolean,
		public company?: Company,
		public department?: Department,
		public isClassifier?: boolean,
		public internalCode?: string
	) {
		if (company) {
		this.company = Company.fromData(company);
		}

		if (department) {
			this.department = Department.fromData(this.department)
		}
	}

	get label() {
		if (!this.name) {
			return null;
		}

		return this.name;
	}
}