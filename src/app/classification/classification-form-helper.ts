import {NumberHelper} from "../shared/globalization";
import {ClassificationType} from "./classification-type";

export class ClassificationFormHelper {
	static attachToForm(form, types) {
		types.forEach(type => {
			if (type.type === ClassificationType.INTERVAL) {
				form[`${type.id}Min`] = [''];
				form[`${type.id}Max`] = [''];
			} else {
				form[type.id] = [''];
			}
		});
	}

	static mapFormValueTypesToList(formValue: any, types: any): Array<any> {
		const formValueTypeFilter = type => {
			const matchIdFilter = key => key.startsWith(type.id);
			return Object.keys(formValue).some(matchIdFilter);
		};

		const ignoreEmptyValuesFilter = value =>
			value.value !== '' || value.min !== '' || value.max !== '';

		const mapFormValueToObject = type => {
			if (type.type === ClassificationType.INTERVAL) {
				return <any>{
					id: type.id,
					min: formValue[`${type.id}Min`] === '' ? '' : NumberHelper.fromPTBR(formValue[`${type.id}Min`]),
					max: formValue[`${type.id}Max`] === '' ? '' : NumberHelper.fromPTBR(formValue[`${type.id}Max`]),
					value: ''
				};
			}

			return <any>{
				id: type.id,
				value: formValue[type.id],
				min: '',
				max: ''
			};
		};

		return types
			.filter(formValueTypeFilter)
			.map(mapFormValueToObject)
			.filter(ignoreEmptyValuesFilter);
	}
}
