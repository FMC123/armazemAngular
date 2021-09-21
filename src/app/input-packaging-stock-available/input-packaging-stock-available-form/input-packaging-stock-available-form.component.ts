import {
	Component,
	EventEmitter,
	group,
	Input,
	OnInit,
	Output
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { errorHandler } from '@angular/platform-browser/src/browser';
import { ActivatedRoute, Router } from '@angular/router';
import { selector } from 'rxjs/operator/multicast';
import { error } from 'util';

import { BatchOperation } from '../../batch-operation/batch-operation';
import { BatchOperationStatus } from '../../batch-operation/batch-operation-status';
import { DateSyncService } from '../../date-sync/date-sync.service';
import { PackStockMovement } from '../../pack-stock/pack-stock-movement';
import { PackStockMovementGroup } from '../../pack-stock/pack-stock-movement-group';
import { PackStockService } from '../../pack-stock/pack-stock.service';
import { PackType } from '../../pack-type/pack-type';
import { PackTypeService } from '../../pack-type/pack-type.service';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Masks } from '../../shared/forms/masks/masks';
import { CustomValidators } from '../../shared/forms/validators/custom-validators';
import { NumberHelper } from '../../shared/globalization';
import { ModalManager } from '../../shared/modals/modal-manager';
import { Notification } from '../../shared/notification';
import { WarehouseStakeholder } from '../../warehouse-stakeholder/warehouse-stakeholder';

@Component({
	selector: 'app-input-packaging-stock-available-form',
	templateUrl: './input-packaging-stock-available-form.component.html'
})
export class InputPackagingStockAvailableComponent implements OnInit {
	@Output() change = new EventEmitter<void>();
	@Input() batchOperation: BatchOperation;
	@Input() indStockOut: boolean;
	group: PackStockMovementGroup;
	movement: PackStockMovement;
	form: FormGroup;
	dateMask = Masks.dateMask;
	stakeholders: Array<WarehouseStakeholder>;
	packTypes: Array<PackType>;
	submitted = false;
	integerMask = Masks.integerMask;
	decimalMask = Masks.decimalMask;
	movementFormModal = new ModalManager();
	loading = false;
	hiddenPackingData: Boolean = true;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private errorHandler: ErrorHandler,
		private service: PackStockService,
		private packTypeService: PackTypeService,
		private packStockService: PackStockService,
		private dateSyncService: DateSyncService
	) {}

	get readOnly() {
		return (
			this.batchOperation &&
			this.batchOperation.status &&
			this.batchOperation.status === BatchOperationStatus.CLOSED.code
		);
	}

	ngOnInit() {
		Notification.clearErrors();

		this.loading = true;
    this.packStockService
      .findByBatchOperation(this.batchOperation.id)
      .then(group => {
        this.group = group;

        if (group == null) {
          this.group = new PackStockMovementGroup();
          this.group.owner = this.batchOperation.owner;
          this.group.recordType = 'AUTOMATIC';
          this.group.indStockOut = this.indStockOut;
          this.group.batchOperation = this.batchOperation;
        }

        this.movement = new PackStockMovement();
        this.buildForm();
        this.loading = false;
      });

		this.packTypeService.list().then(packTypes => {
			this.packTypes = packTypes;//.filter(pt => pt.trackStock);
		});

		this.service
			.hiddenPackingData()
			.then(hiddenPackingData => {
				this.hiddenPackingData = hiddenPackingData;
				this.loading = false;
			})
			.catch(error => {
				this.loading = false;
			});
	}

	buildForm() {
		this.form = this.formBuilder.group({
			packType: [
				this.movement.packType ? this.movement.packType.id || '' : '',
				Validators.required
			],
			unitValueString: [
				this.movement.unitValueString || '0.00',
				[Validators.required, CustomValidators.minValidator(0.01)]
			],
			quantityVariation: [this.movement.quantityVariation]
		});
		if (this.isEditing){
      this.form.addControl("weightString", new FormControl(NumberHelper.toPTBR(this.movement.packType.weight), Validators.required));
    }
	}

	save() {
		this.loading = true;
    if (this.group.batchOperation &&
      this.group.batchOperation.markupGroup &&
      this.group.batchOperation.markupGroup.batches &&
      this.group.batchOperation.markupGroup.batches.length &&
      this.group.batchOperation.markupGroup.batches[0].batch &&
      this.group.batchOperation.markupGroup.batches[0].batch.owner) {
      this.group.owner = this.group.batchOperation.markupGroup.batches[0].batch.owner;
    }

		return this.packStockService
			.save(this.group)
			.then(() => {
				Notification.success('Embalagem salva com sucesso!');
				this.loading = false;
				this.change.emit();
			})
			.catch(error => this.handleError(error));
	}

	handleError(error) {
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}

	get totalPriceString() {
		let quantity = Math.abs(this.form.value.quantityVariation);
		let unitPrice = NumberHelper.fromPTBR(this.form.value.unitValueString);

		return NumberHelper.toPTBR(quantity * unitPrice);
	}

	get unitWeightString() {
		if (!this.packTypes) {
			return NumberHelper.toPTBR(0);
		}

		let packType = this.packTypes.find(
			pt => pt.id === this.form.value.packType
		);

		if (!packType) {
			return NumberHelper.toPTBR(0);
		}

		return packType.weightString;
	}

	get totalWeightString() {
		if (!this.packTypes) {
			return NumberHelper.toPTBR(0);
		}

		let quantity = Math.abs(this.form.value.quantityVariation);
		let packType = this.packTypes.find(
			pt => pt.id === this.form.value.packType
		);

		if (!packType) {
			return NumberHelper.toPTBR(0);
		}

		return NumberHelper.toPTBR(quantity * packType.weight);
	}

	submit() {
		this.submitted = true;

		Object.keys(this.form.controls).forEach(key => {
			this.form.controls[key].markAsDirty();
		});

		if (!this.form.valid) {
			return;
		}
		this.movement.packType = this.packTypes.find(
			pt => pt.id === this.form.value.packType
		);
		this.movement.quantityVariation = Math.abs(
			this.form.value.quantityVariation
		);
    this.movement.unitValue = this.form.value.unitValueString;
		this.movement.unitValueString = this.form.value.unitValueString;
    if (this.isEditing) {
      this.movement.packType.weight = this.form.value.weightString;
      this.movement.packType.weightString = this.form.value.weightString;
      let index = this.group.movements.findIndex((item) => item.packType.code === this.movement.packType.code);
      if (index >= 0) {
        this.group.movements[index] = this.movement;
      }
      this.isEditing = false;
      this.form.removeControl("weightString");
    } else {
      let index = this.group.movements.findIndex((item) => item.packType.code === this.movement.packType.code);
      if (index >= 0) {
        this.group.movements[index] = this.movement;
      } else {
        this.group.movements.push(this.movement);
      }
    }
    this.movement = new PackStockMovement();
		this.buildForm();
	}

	public isEditing: boolean = false;

	edit(event) {
		this.isEditing = true;
		this.movement = event;
    this.buildForm();
	}

	cancelEdit() {
		this.isEditing = false;
    this.movement = new PackStockMovement();
    this.buildForm();
	}
}
