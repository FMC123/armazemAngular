import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ErrorHandler } from '../../shared/shared.module';
import { Notification } from '../../shared/notification';
import {
	FormGroup,
	FormBuilder,
	Validators,
	ValidatorFn,
	AbstractControl
} from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Masks } from '../../shared/forms/masks/masks';
import { NumberHelper } from '../../shared/globalization';
import { User } from '../../user/user';
import {ClassificationItem} from "../../classification/classification-item";
import {ClassificationVersion} from "../../classification/classification-version";
import {ClassificationService} from "../../classification/classification.service";
import {ClassificationType} from "../../classification/classification-type";


@Component({
	selector: 'app-classification-item-form',
	templateUrl: 'classification-item-form.component.html'
})
export class ClassificationItemFormComponent implements OnInit, OnDestroy {
	@Input() classificationVersion: ClassificationVersion;
	@Input() submitted = false;
	@Input() specialCoffee = false;
	@Output() classificationItensList: EventEmitter<Array<ClassificationItem>> = new EventEmitter<Array<ClassificationItem>>();
	types: Array<ClassificationType> = [];
	classificationItemEditing: ClassificationItem;

	form: FormGroup;
	loading = false;

	decimalMask = Masks.decimalMask;
	unlimitedDecimalMask = Masks.unlimitedDecimalMask;

	typeSubscription: Subscription;

	constructor(
		private classificationService: ClassificationService,
		private formBuilder: FormBuilder,
		private errorHandler: ErrorHandler
	) { }

	ngOnInit() {
		Notification.clearErrors();
		this.loading = true;

		this.classificationService
			.listTypes()
			.then(types => {
				this.types = types;

				// atribui todos os tipos para o objeto princpial, para fazer validações do obrigatórios
				this.classificationVersion.allTypes = types;

				this.loadRequiredItems();
				this.buildForm(new ClassificationItem());
				this.loading = false;
			})
			.catch(error => this.handleError(error));
	}

	loadRequiredItems() {
		if (!this.types) {
			return;
		}

		this.types.forEach(type => {
			if (type.orderNormal) {
				let existsInList = false;
				for (const item of this.classificationItens) {
					if (item.classificationType && type.id === item.classificationType.id) {
						existsInList = true;
						break;
					}
				}
				if (!existsInList) {
					let classificationItem = new ClassificationItem();
					classificationItem.classificationType = type;
					classificationItem.classificationDate = Date.now();
					classificationItem.value = "";
					classificationItem.classifiedBy = new User();
					classificationItem.classifiedBy.id = "";
					this.classificationItens.push(classificationItem);
				}
			}
		});

		this.classificationItens.sort((item1, item2) => {
			if (item1.classificationType.orderNormal && item2.classificationType.orderNormal) {
				return item1.classificationType.orderNormal - item2.classificationType.orderNormal;
			}
			else if (item1.classificationType.orderNormal && !item2.classificationType.orderNormal) {
				return -1;
			}
			else if (!item1.classificationType.orderNormal && item2.classificationType.orderNormal) {
				return 1;
			}
			else {
				return 0;
			}
		});

	}

	ngOnDestroy() {
		this.destroyTypeSubscription();
	}

	destroyTypeSubscription() {
		if (this.typeSubscription && !this.typeSubscription.closed) {
			this.typeSubscription.unsubscribe();
		}
	}

	get type() {
		if (!this.form) {
			return null;
		}

		const classificationTypeId = this.form.value.classificationTypeId;

		if (!classificationTypeId) {
			return null;
		}

		const type = this.types.find(t => t.id === classificationTypeId);
		return type || null;
	}

	get values() {
		const type = this.type;

		if (!type) {
			return null;
		}

		return type.values;
	}

	get typeRequiredText() {
		const type = this.type;
		return (type != null) ? type.requiredString : '';
	}

	get classificationItens() {
		if (!this.classificationVersion || !this.classificationVersion.items) {
			return new Array<ClassificationItem>();
		}
		return this.classificationVersion.items;
	}

	buildForm(classificationItem: ClassificationItem) {
		this.form = this.formBuilder.group({
			classificationTypeId: [classificationItem.classificationType
				? classificationItem.classificationType.id
				: '' || '', Validators.required],
			classificationValue: [
				classificationItem.value || '',
				[
					Validators.required,
					this.minValidator(),
					this.maxValidator(),
					this.scaleValidator()
				]
			]
		});

		this.destroyTypeSubscription();

		this.typeSubscription = this.form
			.get('classificationTypeId')
			.valueChanges.subscribe(value => {
				this.form.get('classificationValue').setValue('');
			});
	}

	get availableTypes() {
		const notInList = type => {
			if (
				this.classificationItemEditing &&
				this.classificationItemEditing.classificationType.id === type.id
			) {
				return true;
			}

			// quando é classificação especial, não pode mostrar itens não especial
			if (this.specialCoffee && (type.specialCoffeeItem == null || type.specialCoffeeItem === false)) {
				return false;
			}

			const alreadyInList = this.classificationItens.some(au => au.classificationType.id === type.id);
			return !alreadyInList;
		};

		return this.types.filter(notInList);
	}

	add() {
		Object.keys(this.form.controls).forEach(key => {
			this.form.controls[key].markAsDirty();
		});

		if (!this.form.valid) {
			return;
		}

		const classificationType = this.types.find(ctypes => ctypes.id === this.form.value.classificationTypeId);
		const classificationValue = this.form.value.classificationValue;

		let classificationItem = this.classificationItens.find(d => d.classificationType.id === classificationType.id);

		let toInclude = false;
		if (!classificationItem) {
			classificationItem = new ClassificationItem();
			toInclude = true;
		}

		classificationItem.classificationType = classificationType;
		classificationItem.value = classificationValue;
		classificationItem.classificationDate = Date.now();

		if (toInclude) {
			this.classificationItens.push(classificationItem);
		}

		this.classificationItemEditing = null;
		this.buildForm(new ClassificationItem());
	}

	edit(classificationItem: ClassificationItem) {
		this.classificationItemEditing = classificationItem;
		this.buildForm(this.classificationItemEditing);
	}

	remove(type: ClassificationType) {
		const index = this.classificationItens.findIndex(item => item.classificationType === type);

		if (index === -1) {
			return;
		}

		this.classificationItens.splice(index, 1);
	}

	handleError(error) {
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}

	minValidator(): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } => {
			if (!this.type) {
				return null;
			}

			const { min } = this.type;

			if (!min) {
				return null;
			}

			const value = control.value;
			if (!value && value !== '0' && value !== 0) return;
			if (NumberHelper.fromPTBR(value) < min) {
				const requiredValue = min % 1 !== 0 ? NumberHelper.toPTBR(min) : min;
				return { min: { requiredValue: requiredValue, actualValue: value } };
			}
			return null;
		};
	}

	maxValidator(): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } => {
			if (!this.type) {
				return null;
			}

			const { max } = this.type;

			if (!max) {
				return null;
			}

			const value = control.value;
			if (!value && value !== '0' && value !== 0) return;

			if (NumberHelper.fromPTBR(value) > max) {
				const requiredValue = max % 1 !== 0 ? NumberHelper.toPTBR(max) : max;
				return { max: { requiredValue: requiredValue, actualValue: value } };
			}
			return null;
		};
	}

	scaleValidator(): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } => {
			if (!this.type) {
				return null;
			}

			const { scale } = this.type;

			if (!scale) {
				return null;
			}

			const value = control.value;
			if (!value && value !== '0' && value !== 0) return;

			const splitted = value.split(',');
			const isInteger = splitted.length <= 1;

			if (isInteger) {
				return null;
			}

			const valueScale = splitted[1].length;

			if (valueScale > Number(scale)) {
				return {
					scale: { requiredValue: scale, actualValue: valueScale }
				};
			}

			return null;
		};
	}

	fillValue(value: any, item: ClassificationItem) {
		if (!item || !value) {
			return;
		}
		this.classificationItens.forEach(i => {
			if (item.classificationType && i.classificationType
				&& item.classificationType.id === i.classificationType.id) {
				i.value = value;
			}
		});
	}

}
