import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ClassificationVersion } from '../classification-version';
import { ClassificationType } from '../classification-type';
import { ErrorHandler } from '../../shared/shared.module';
import { Notification } from '../../shared/notification';
import { ClassificationService } from '../classification.service';
import { ClassificationItem } from '../classification-item';
import { ClassificationTypeGroup } from '../classification-type-group';

import {
	FormGroup,
	FormBuilder,
	Validators,
	ValidatorFn,
	AbstractControl
} from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ClassificationValue } from '../classification-value';
import { Masks } from '../../shared/forms/masks/masks';
import { NumberHelper } from '../../shared/globalization';
import { User } from '../../user/user';


@Component({
	selector: 'app-classification-item-form',
	templateUrl: 'classification-item-form.component.html',
	styleUrls: ['classification-item-form.component.css']
})
export class ClassificationItemFormComponent implements OnInit, OnDestroy {
	@Input() classificationVersion: ClassificationVersion;
	@Input() submitted = false;
	@Input() users: Array<User> = [];
	@Input() specialCoffee = false;
	@Input() isShowItemOwner = false;
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
				this.buildForm();
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

	buildForm() {
		this.form = this.formBuilder.group({});

		this.buildSelectableItemForm(new ClassificationItem());
		this.buildClassificationItensForm();
	}

	buildSelectableItemForm(classificationItem: ClassificationItem) {

		if(!this.availableTypes || this.availableTypes.length <= 0) {
			if(this.form.contains("classificationTypeId")) {
				this.form.get("classificationTypeId").disable();
			}
			
			if(this.form.contains("classificationValue")) {
				this.form.get("classificationValue").disable();
			}
			
			if(this.form.contains("itemOwner")) {
				this.form.get("itemOwner").disable();
			}
			
			return;
		}


		this.form.setControl("classificationTypeId", this.formBuilder.control(
			classificationItem.classificationType ? classificationItem.classificationType.id : '' || '',
			Validators.required
		));

		const getType = () => { return this.type };

		this.form.setControl("classificationValue", this.formBuilder.control(classificationItem.value || '', [
			Validators.required,
			this.minValidatorForType(getType),
			this.maxValidatorForType(getType),
			this.scaleValidatorForType(getType)
		]));

		this.form.setControl("itemOwner", this.formBuilder.control(
			classificationItem.classifiedBy ? classificationItem.classifiedBy.id : '' || '', []));

		this.destroyTypeSubscription();

		this.typeSubscription = this.form
			.get('classificationTypeId')
			.valueChanges.subscribe(value => {
				this.form.get('classificationValue').setValue('');
			});

	}

	buildClassificationItensForm() {

		this.classificationItens.forEach(ci => {
			const formControl = this.formBuilder.control(ci.value || '', []);
			
			const validators: ValidatorFn[] = [];

			if (ci.classificationType.requiredNormal) {
				validators.push(Validators.required);
			}

			const getType = () => { return ci.classificationType };

			if (ci.classificationType.type == 'INTERVAL') {
				validators.push(
					this.minValidatorForType(getType),
					this.maxValidatorForType(getType),
					this.scaleValidatorForType(getType)
				);
			}
			
			if(ci.classificationType.classificationTypeGroup) {
				validators.push(this.getGroupSumValidator());
			}
			
			formControl.setValidators(validators);
			this.form.addControl(ci.classificationType.id, formControl);
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

			// quando não é classificação especial, não pode mostrar itens do especial
			if (!this.specialCoffee && (type.specialCoffeeItem != null && type.specialCoffeeItem === true)) {
				return false;
			}

			const alreadyInList = this.classificationItens.some(au => au.classificationType.id === type.id);
			return !alreadyInList;
		};

		return this.types.filter(notInList);
	}

	add() {
		const classificationTypeIdControl = this.form.get("classificationTypeId");
		const classificationValueControl = this.form.get("classificationValue");

		classificationTypeIdControl.markAsDirty();
		classificationValueControl.markAsDirty();

		if (!classificationTypeIdControl.valid || !classificationValueControl.valid) {
			return;
		}

		const classificationType = this.types.find(ctypes => ctypes.id === classificationTypeIdControl.value);

		let classificationItem = this.classificationItens.find(d => d.classificationType.id === classificationType.id);

		let toInclude = false;
		if (!classificationItem) {
			classificationItem = new ClassificationItem();
			toInclude = true;
		}

		classificationItem.classificationType = classificationType;
		classificationItem.value = classificationValueControl.value;;
		classificationItem.classifiedBy = this.users.find(
			u => u.id === this.form.value.itemOwner
		);
		classificationItem.classificationDate = Date.now();

		if (toInclude) {
			this.classificationItens.push(classificationItem);
		}

		this.classificationItemEditing = null;
		this.buildSelectableItemForm(new ClassificationItem());
	}

	edit(classificationItem: ClassificationItem) {
		this.classificationItemEditing = classificationItem;
		this.buildSelectableItemForm(this.classificationItemEditing);
	}

	remove(classificationItem: ClassificationItem) {
		const index = this.classificationItens.findIndex(item => item === classificationItem);

		if (index === -1) {
			return;
		}

		this.classificationItens.splice(index, 1);
		this.buildSelectableItemForm(classificationItem);
	}

	handleError(error) {
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}

	/**
	 * Retorna {@link ValidatorFn} minValidator parametrizado para {@link ClassificationType} informado.
	 *
	 * @param getType deve ser a função que retorna o ClassificationType,
	 * garantindo que o validador utilizará o valor do parametro 'min' do objeto em seu estado atual.
	 *
	 */
	minValidatorForType(getType: () => ClassificationType): ValidatorFn {
		return this.minValidator(() => {
			const type = getType();
			return type ? type.min : null;
		});
	}

	/**
	 * Retorna {@link ValidatorFn} maxValidator parametrizado para o valor mínimo informado.
	 *
	 * @param getMin deve ser a função que retorna o valor do parâmetro 'min',
	 * garantindo que o validador utilizará o 'min' em seu estado atual.
	 *
	 */
	minValidator(getMin: () => number): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } => {
			const min = getMin();

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

	/**
	 * Retorna {@link ValidatorFn} maxValidator parametrizado para {@link ClassificationType} informado.
	 *
	 * @param getType deve ser a função que retorna o ClassificationType,
	 * garantindo que o validador utilizará o valor do parametro 'max' do objeto em seu estado atual.
	 *
	 */
	maxValidatorForType(getType: () => ClassificationType): ValidatorFn {
		return this.maxValidator(() => {
			const type = getType();
			return type ? type.max : null;
		});
	}

	/**
	 * Retorna {@link ValidatorFn} maxValidator parametrizado para o valor mínimo informado.
	 *
	 * @param getMax deve ser a função que retorna o valor do parâmetro 'max',
	 * garantindo que o validador utilizará o 'max' em seu estado atual.
	 *
	 */
	maxValidator(getMax: () => number): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } => {
			const max = getMax();

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

	/**
	 * Retorna {@link ValidatorFn} scaleValidator parametrizado para {@link ClassificationType} informado.
	 *
	 * @param getType deve ser a função que retorna o ClassificationType,
	 * garantindo que o validador utilizará o valor do parametro 'scale' do objeto em seu estado atual.
	 *
	 */
	scaleValidatorForType(getType: () => ClassificationType): ValidatorFn {
		return this.scaleValidator(() => {
			const type = getType();
			return type ? type.scale : null;
		});
	}

	/**
	 * Retorna {@link ValidatorFn} maxValidator parametrizado para o valor mínimo informado.
	 *
	 * @param getScale deve ser a função que retorna o valor do parâmetro 'scale',
	 * garantindo que o validador utilizará o 'scale' em seu estado atual.
	 *
	 */
	scaleValidator(getScale: () => number): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } => {
			const scale = getScale();

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
	
	getGroupSumValidator(): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } => {
			const controlName = this.getControlName(control);
			
			const type = this.types.find(t => t.id === controlName);
			
			if(!type || !type.classificationTypeGroup || !type.classificationTypeGroup.id) return null;
			
			const controls = this.getControlsByClassificationTypeGroup(type.classificationTypeGroup);
			
			const groupSum = controls.reduce((agg, c) => {
				const controlValue = NumberHelper.fromPTBR(c.value || 0);
				
				if(control.dirty) c.markAsDirty();
				
				return agg + controlValue;
			}, 0);
			
			if(groupSum >= type.classificationTypeGroup.groupMin && groupSum <= type.classificationTypeGroup.groupMax) {
				//a soma confere, então remove o erro de todos os FormControl do grupo e retorna null pro validador
				controls.forEach(c => {
					this.removeFormControlError(c, "groupSum");
				});
				
				return null;
			}

			const validationErrors = {
				groupSum: { 
					requiredMin: type.classificationTypeGroup.groupMin, 
					requiredMax: type.classificationTypeGroup.groupMax, 
					actualValue: groupSum
				}
			};
			
			//marca o erro pra todos os FormControl do grupo
			controls.forEach(c => {
				c.setErrors(validationErrors);
			});
			
			return validationErrors;
		};
	}
	
	getControlsByClassificationTypeGroup(typeGroup: ClassificationTypeGroup): AbstractControl[] {
		if(!typeGroup || !typeGroup.id) return [];
		
		const controls: AbstractControl[] = this.classificationItens.reduce((controls, ci) => {
			if(!ci.classificationType.classificationTypeGroup || ci.classificationType.classificationTypeGroup.id !== typeGroup.id) return controls;
			
			const typeControl = this.form.get(ci.classificationType.id);
			
			if(!typeControl) return controls;
			
			controls.push(typeControl);
			
			return controls;
		}, []);
		
		return controls;
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

	fillClassifiedBy(value: any, item: ClassificationItem) {
		if (!item || !value) {
			return;
		}
		this.classificationItens.forEach(i => {
			if (item.classificationType && i.classificationType
				&& item.classificationType.id === i.classificationType.id) {
				i.classifiedBy = new User();
				i.classifiedBy.id = value;
			}
		});
	}
	
	private getControlName(control: AbstractControl): string | null {
		const group = <FormGroup>control.parent;

		if (!group) return null;

		let name: string;

		Object.keys(group.controls).forEach(key => {
			let childControl = group.get(key);

			if (childControl !== control) {
				return;
			}

			name = key;
		});

		return name;
	}
	
	removeFormControlError(control: AbstractControl, errorName: string) {
		if(!control || !control.errors) return;
		
		if(control.errors[errorName]) {
			delete control.errors[errorName]; 
		}
			
		if (Object.keys(control.errors).length === 0) {
			control.setErrors(null);
		}
	}
	
	get isShowDoubleColumnItens() {
		return !this.isShowItemOwner && !this.isDynamicItemList;
	}
	
	get isDynamicItemList() {
		return this.types.some(t => !t.orderNormal || t.orderNormal <= 0);
	}
}
