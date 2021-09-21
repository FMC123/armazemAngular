import { Component, OnInit, Input, OnDestroy, Output } from '@angular/core';
import { ClassificationType } from '../../classification/classification-type';
import { ErrorHandler } from '../../shared/shared.module';
import { Notification } from '../../shared/notification/notification';
import { ClassificationAuthorizationService } from '../classification-authorization.service';
import { ClassificationItem } from '../../classification/classification-item';
import {
	FormGroup,
	FormBuilder,
	Validators,
	ValidatorFn,
	AbstractControl
} from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ClassificationValue } from '../../classification/classification-value';
import { Masks } from '../../shared/forms/masks/masks';
import { NumberHelper } from '../../shared/globalization';
import { User } from '../../user/user';
import { ClassificationVersion } from '../../classification/classification-version';
import { EventEmitter } from '@angular/common/src/facade/async';

@Component({
	selector: 'app-classification-authorization-item-form',
	templateUrl: 'classification-authorization-item-form.component.html'
})
export class ClassificationAuthorizationItemFormComponent
	implements OnInit, OnDestroy {
	@Input() classificationVersion: ClassificationVersion;
	@Input() submitted = false;
	@Input() users: Array<User> = [];
	@Output() dirty = new EventEmitter();
	types: Array<ClassificationType> = [];
	classificationItemEditing: ClassificationItem;

	form: FormGroup;
	loading = false;

	decimalMask = Masks.decimalMask;
	unlimitedDecimalMask = Masks.unlimitedDecimalMask;

	typeSubscription: Subscription;

	constructor(
		private service: ClassificationAuthorizationService,
		private formBuilder: FormBuilder,
		private errorHandler: ErrorHandler
	) {}

	ngOnInit() {
		Notification.clearErrors();
		this.loading = true;

		this.service
			.listTypes()
			.then(types => {
				this.types = types;
				this.buildForm(new ClassificationItem());
				this.loading = false;
			})
			.catch(error => this.handleError(error));
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

		const typeName = this.form.value.type;

		if (!typeName) {
			return null;
		}

		const type = this.types.find(t => t.id === typeName);
		return type || null;
	}

	get values() {
		const type = this.type;

		if (!type) {
			return null;
		}

		return type.values;
	}

	get data() {
		return this.classificationVersion.items;
	}

	buildForm(classificationItem: ClassificationItem) {
		this.form = this.formBuilder.group({
			type: [classificationItem.classificationType ?  classificationItem.classificationType.id : '' || '', Validators.required],
			value: [
				classificationItem.value || '',
				[
					Validators.required,
					this.minValidator(),
					this.maxValidator(),
					this.scaleValidator()
				]
			],
			itemOwner: [classificationItem.classifiedBy || '']
		});

		this.destroyTypeSubscription();

		this.typeSubscription = this.form
			.get('type')
			.valueChanges.subscribe(value => {
				this.form.get('value').setValue('');
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

			const alreadyInList = this.data.some(au => au.classificationType.id === type.id);
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

		const type = this.form.value.type;
		const value = this.form.value.value;

		let classificationItem = this.data.find(d => d.classificationType.id === type);

		let toInclude = false;
		if (!classificationItem) {
			classificationItem = new ClassificationItem();
			toInclude = true;
		}

		classificationItem.classificationType = this.types.find(ctypes => ctypes.id === type);
		classificationItem.value = value;
		classificationItem.classifiedBy = this.users.find(
			u => u.id === this.form.value.itemOwner
		);
		classificationItem.classificationDate = Date.now();

		if (toInclude) {
			this.data.push(classificationItem);
		}

		this.classificationItemEditing = null;
		this.buildForm(new ClassificationItem());
		this.dirty.emit();
	}

	edit(classificationItem: ClassificationItem) {
		this.classificationItemEditing = classificationItem;
		this.buildForm(this.classificationItemEditing);
		this.form.get('itemOwner').setValue(classificationItem.classifiedBy.id);
	}

	remove(item: ClassificationItem) {
		
		const index = this.data.findIndex(i => i.classificationType.id === item.classificationType.id);

		if (index === -1) {
			return;
		}

		this.data.splice(index, 1);
		this.dirty.emit();
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
}
