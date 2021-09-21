import { Person } from '../person/person';
import { DateTimeHelper } from './../shared/globalization/date-time-helper';

export class Collaborator {
	static fromListData(listData: Array<Collaborator>): Array<Collaborator> {
		return listData.map(data => {
			return Collaborator.fromData(data);
		});
	}

	static fromData(data: Collaborator): Collaborator {
		if (!data) return new this();
		let collaborator = new this(
			data.id,
			data.person,
			data.collaboratorType,
			data.initialQuota,
			data.admissionDate,
			data.dateDisconnection,
			data.observation,
			data.registration,
			data.code
		);
		return collaborator;
	}

	constructor(
		public id?: string,
		public person?: Person,
		public collaboratorType?: string,
		public initialQuota?: number,
		public admissionDate?: number,
		public dateDisconnection?: number,
		public observation?: string,
		public registration?: string,
		public code?: string
	) {
		if (person) {
			this.person = Person.fromData(person);
		}
	}

	get label() {
		return [this.name, this.registration].filter(l => !!l).join(' - ');
	}

	get name() {
		if (!this.person) {
			return null;
		}

		return this.person.name;
	}

	get admissionDateString() {
		return DateTimeHelper.toDDMMYYYY(this.admissionDate);
	}

	get dateDisconnectionString() {
		return DateTimeHelper.toDDMMYYYY(this.dateDisconnection);
	}

	set admissionDateString(value) {
		this.admissionDate = DateTimeHelper.fromDDMMYYYY(value);
	}

	set dateDisconnectionString(value) {
		this.dateDisconnection = DateTimeHelper.fromDDMMYYYY(value);
	}
}
