import { Notification } from '../../../shared/notification';
import {
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
	ViewChildren
} from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators
} from '@angular/forms';
import { Subscription } from 'rxjs/Rx';

import { AuthService } from '../../../auth/auth.service';
import { Position } from '../../../position/position';
import { PositionService } from '../../../position/position.service';
import { ErrorHandler } from '../../../shared/errors/error-handler';
import { Focusable } from '../../../shared/forms/focusable/focusable.directive';
import { Masks } from '../../../shared/forms/masks/masks';
import { CustomValidators } from '../../../shared/forms/validators/custom-validators';
import { NumberHelper } from '../../../shared/globalization';
import { Stack } from '../../../stack/stack';
import { StackService } from '../../../stack/stack.service';
import { StorageUnitOut } from '../../../storage-unit/out/storage-unit-out';
import { StorageUnitOutService } from '../../../storage-unit/out/storage-unit-out.service';
import { StorageUnit } from '../../../storage-unit/storage-unit';
import { StorageUnitService } from '../../../storage-unit/storage-unit.service';
import { UnitType } from '../../../unit-type/unit-type';
import {KilosSacksConverterService} from "../../../shared/kilos-sacks-converter/kilos-sacks-converter.service";
import {BatchOperation} from "../../batch-operation";

@Component({
	selector: 'app-batch-operation-out-storage-unit-edit-form-modal',
	templateUrl:
		'./batch-operation-out-storage-unit-edit-form-modal.component.html'
})
export class BatchOperationOutStorageUnitEditFormModalComponent
	implements OnInit, OnDestroy {
	@Output() close: EventEmitter<void> = new EventEmitter<void>(false);
	@Input() storageUnitOut: StorageUnitOut;
  @Input() markupGroupShippingAuthorization: any;
  @Input() batchOperation: BatchOperation;
	@ViewChildren(Focusable) focusables;
	integerMask = Masks.integerMask;
	decimalMask = Masks.decimalMask;
	positions: Array<Position>;
	stacks: Array<Stack>;
	form: FormGroup;
	stackSubscription: Subscription;
	loading = false;
	previouslyDiscountedQuantity = 0;

	constructor(
		private auth: AuthService,
		private formBuilder: FormBuilder,
		private errorHandler: ErrorHandler,
		private positionService: PositionService,
		private stackService: StackService,
		private storageUnitOutService: StorageUnitOutService,
		private storageUnitService: StorageUnitService,
    private kilosSacksConverterService: KilosSacksConverterService
	) {}

	ngOnInit() {
		this.positionService
			.listByWarehouseAndType(this.auth.accessToken.warehouse.id)
			.then(positions => {
				this.positions = positions;
			});

		this.storageUnitService
			.findWithBatches(this.storageUnitOut.storageUnit.id)
			.then(storageUnit => {
				this.storageUnitOut.storageUnit = storageUnit;
				this.previouslyDiscountedQuantity = this.storageUnitOut.quantity || 0;
				this.buildForm();
			});
	}

	ngOnDestroy() {
		[this.stackSubscription].forEach(subscription => {
			if (!subscription && !subscription.closed) {
				subscription.unsubscribe();
			}
		});
	}

	get storageUnit() {
		return this.storageUnitOut.storageUnit;
	}

	focusOnInput() {
		return () => {
			if (this.focusables && this.focusables.length > 0) {
				this.focusables.first.focus();
			}
		};
	}

	buildForm() {
		const group = {
			quantityString: [
				this.storageUnitOut.quantityString || '',
				[
					Validators.required,
					CustomValidators.minValidator(1),
					this.remainingWeightValidation.bind(this)
				]
			],
			positionId: ['', [Validators.required]],
			stackId: ['', [Validators.required]],
			stackHeight: ['', [Validators.required, CustomValidators.minValidator(1)]]
		};

		this.form = this.formBuilder.group(group);

		this.stackSubscription = this.form
			.get('positionId')
			.valueChanges.subscribe(value => {
				this.refreshStacks(value);
			});

		return this.refreshPosition(this.storageUnit)
			.then(() => {
				this.loading = false;
			})
			.catch(error => this.handleError(error));
	}

	submit() {
		Object.keys(this.form.controls).forEach(key => {
			this.form.controls[key].markAsDirty();
		});

		if (this.locationEnabled) {
			this.form.get('positionId').enable();
			this.form.get('stackId').enable();
			this.form.get('stackHeight').enable();
		} else {
			this.form.get('positionId').disable();
			this.form.get('stackId').disable();
			this.form.get('stackHeight').disable();
		}

		if (!this.form.valid) {
			return;
		}

    // let isValid = true;
    // if (this.markupGroupShippingAuthorization) {
    //   this.markupGroupShippingAuthorization.batches.map(i => {
    //     if (i.batch.id === this.storageUnitOut.markupGroupBatch.batch.id) {
    //       if(i.quantity < NumberHelper.fromPTBR(this.form.value.quantityString)) {
    //         Notification.error("O valor despejado é maior que o previsto!");
    //         isValid = false;
    //       }
    //     }
    //   });
    // }
    // if (!isValid)
    //   return;

		this.loading = true;

		this.storageUnitOut.quantityString = this.form.value.quantityString;
		this.storageUnitOut.storageUnit.position.id = this.form.value.positionId;
		this.storageUnitOut.storageUnit.stack.id = this.form.value.stackId;
		this.storageUnitOut.storageUnit.stackHeight = this.form.value.stackHeight;

		this.storageUnitOutService
			.save(this.storageUnitOut)
			.then(_ => {
				this.loading = false;
				Notification.success(
					'Embarque da unidade de armazenamento salvo com sucesso!'
				);
				(<any>jQuery)('.modal').modal('hide');
			})
			.catch(error => {
				this.loading = false;
				this.errorHandler.fromServer(error);
			});
	}

	remainingWeightValidation(control: AbstractControl) {

		const comparable = this.storageUnit.quantity + this.previouslyDiscountedQuantity;

		const value = control.value;
		if (!value && value !== '0' && value !== 0) return;
		if (NumberHelper.fromPTBR(value) > comparable) {
			let requiredValue =
				comparable % 1 !== 0 ? NumberHelper.toPTBR(comparable) : comparable;
        //todo rever regra de quantidade mostrada na mensagem
        if (this.storageUnitOut.markupGroupBatch && this.storageUnitOut.markupGroupBatch.quantity) {
          requiredValue = this.storageUnitOut.markupGroupBatch.quantity;
          }
        return { max: { requiredValue: requiredValue, actualValue: value } };
		}

		return null;
	}

	get remainingWeightString() {
		return NumberHelper.toPTBR(this.remainingWeight);
	}

	get remainingWeight() {
		if (!this.storageUnit) {
			return 0;
		}

		return (
			Number(this.storageUnit.quantity) -
			NumberHelper.fromPTBR(this.form.value.quantityString) +
			this.previouslyDiscountedQuantity
		);
	}

	get locationEnabled() {
    if(this.storageUnit.position.isSilo)
      return false;

    return (
			(this.storageUnit.batches && this.storageUnit.batches.length >= 2) ||
			this.remainingWeight > 0
		);
	}

	get unitType() {
		if (!this.storageUnit) {
			return UnitType.KG.code;
		}

		if (!this.storageUnit.batches || !this.storageUnit.batches.length) {
			return UnitType.KG.code;
		}

		return this.storageUnit.batches[0].unitType;
	}

	handleError(error) {
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}

	private refreshQuantity(storageUnit: StorageUnit) {
		const storageUnitBatch = storageUnit.batches.find(
			b => b.batch.id === this.storageUnitOut.markupGroupBatch.batch.id
		);
		this.form.get('quantityString').setValue(storageUnitBatch.quantityString);
	}

	private refreshPosition(storageUnit: StorageUnit) {
		if (!storageUnit || !storageUnit.position || !storageUnit.position.id) {
			this.form.get('positionId').setValue(null);
			this.form.get('stackId').setValue(null);
			this.form.get('stackHeight').setValue(null);
			return Promise.resolve();
		}

		this.form.get('positionId').setValue(storageUnit.position.id);
		this.form.get('stackId').setValue(storageUnit.stack.id);
		this.form.get('stackHeight').setValue(storageUnit.stackHeight);

		let promises = [];

		if (storageUnit.position && storageUnit.position.id) {
			promises.push(this.refreshStacks(storageUnit.position.id));
		}

		return Promise.all(promises);
	}

	private refreshStacks(positionId) {
		if (!positionId) {
			this.stacks = [];
			this.form.get('stackId').setValue('');
			return Promise.resolve();
		}

		return this.stackService.list(positionId).then(stacks => {
			this.stacks = stacks;

			const currentStackId = this.form.get('stackId').value;
			if (!currentStackId || !this.stacks.some(s => s.id === currentStackId)) {
				this.form.get('stackId').setValue(this.stacks[0].id);
			}
		});
	}

  getAuthorizedInfo(batchId) {
    let res = '-';
    if (this.markupGroupShippingAuthorization) {
      this.markupGroupShippingAuthorization.batches.map(i => {
        if (i.batch.id === batchId) {
          let secondPart = `${NumberHelper.toPTBR(i.currentQuantityString)} (${this.kilosSacksConverterService.kilosToSacks(i.currentQuantity)} SC)`;
          let firstPart = `${NumberHelper.toPTBR(i.quantityString)} (${i.sackQuantity} SC)`;
          res = `${firstPart} / ${secondPart}`;
        }
      });
    }
    return res;
  }
}
