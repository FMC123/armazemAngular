import { Notification } from '../../../shared/notification';
import { MarkupGroupBatch } from '../../../markup-group/batch/markup-group-batch';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { Transportation } from '../../../transportation/transportation';

@Component({
  selector: 'app-batch-operation-out-storage-unit-new-form-modal',
  templateUrl: './batch-operation-out-storage-unit-new-form-modal.component.html',
})
export class BatchOperationOutStorageUnitNewFormModalComponent implements OnInit, OnDestroy {
  @Output() close: EventEmitter<void> = new EventEmitter<void>(false);
  @Input() markupGroupBatch: MarkupGroupBatch;
  @Input() markupGroupShippingAuthorization: any;
  @Input() batchOperation: BatchOperation;
  @Input() transportation: Transportation;

  @ViewChildren(Focusable) focusables;
  integerMask = Masks.integerMask;
  decimalMask = Masks.decimalMask;
  positions: Array<Position>;
  stacks: Array<Stack>;
  form: FormGroup;
  stackSubscription: Subscription;
  storageUnitSubscription: Subscription;
  loading = false;
  storageUnits: Array<StorageUnit>;

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
    this.positionService.listByWarehouseAndType(this.auth.accessToken.warehouse.id).then(positions => {
      this.positions = positions;
    });

    this.storageUnitService.listByBatch(this.markupGroupBatch.batch.id).then((storageUnits) => {
      this.storageUnits = storageUnits || [];
    });

    this.buildForm();
  }

  ngOnDestroy() {
    [
      this.storageUnitSubscription,
      this.stackSubscription,
    ].forEach(subscription => {
      if (!subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }

  get storageUnit() {
    if (!this.form || !this.form.value.storageUnitId) {
      return null;
    }

    return this.storageUnits.find(su => su.id === this.form.value.storageUnitId);
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
      storageUnitId: ['', [ Validators.required ]],
      quantityString: [ '' , [Validators.required, CustomValidators.minValidator(1), this.remainingWeightValidation.bind(this)]],
      positionId: ['', [ Validators.required ]],
      stackId: ['', [ Validators.required ]],
      stackHeight: ['', [ Validators.required, CustomValidators.minValidator(1) ]],
    };

    this.form = this.formBuilder.group(group);

    this.storageUnitSubscription = this.form.get('storageUnitId').valueChanges.subscribe((value) => {
      let storageUnit = null;

      if (value) {
        storageUnit = this.storageUnits.find(su => su.id === value);
      }

      this.refreshPosition(storageUnit);
      this.refreshQuantity(storageUnit);
    });

    this.stackSubscription = this.form.get('positionId').valueChanges.subscribe((value) => {
      this.refreshStacks(value);
    });
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
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

    let isValid = true;
    let left = Math.abs(this.markupGroupBatch.leftQuantity);
    if (this.markupGroupShippingAuthorization) {
      this.markupGroupShippingAuthorization.batches.map(i => {
        if (i.batch.id === this.markupGroupBatch.batch.id) {
          let shippingLeft = Math.abs(i.leftQuantity);
          if(shippingLeft < left) {
            left = shippingLeft;
          }
        }
      });
    }
    if(left < NumberHelper.fromPTBR(this.form.value.quantityString)) {
      Notification.error("O valor despejado é maior que o previsto!");
      isValid = false;
    }

    if (!isValid)
      return;

    if (!this.form.valid) {
      return;
    }

    this.loading = true;

    const storageUnitOut = new StorageUnitOut();
    storageUnitOut.markupGroupBatch = this.markupGroupBatch;
    storageUnitOut.storageUnit = this.storageUnit;
    storageUnitOut.quantityString = this.form.value.quantityString;
    storageUnitOut.storageUnit.position.id = this.form.value.positionId;

    if(!this.storageUnit.position.isSilo){
      storageUnitOut.storageUnit.stack.id = this.form.value.stackId;
      storageUnitOut.storageUnit.stackHeight = this.form.value.stackHeight;
    }

    this.storageUnitOutService.save(storageUnitOut)
      .then(_ => {
        this.loading = false;
        Notification.success('Embarque da unidade de armazenamento salvo com sucesso!');
        (<any>jQuery)('.modal').modal('hide');
      })
      .catch(error => {
        this.loading = false;
        this.errorHandler.fromServer(error);
      });
  }

  remainingWeightValidation(control: AbstractControl) {
    if (!this.storageUnit || !this.storageUnit.quantity) {
      return null;
    }

    const comparable = this.storageUnit.quantity;

    const value = control.value;
    if (!value && value !== '0' && value !== 0) return;

    if (NumberHelper.fromPTBR(value) > comparable) {

      let requiredValue = comparable % 1 !== 0 ? NumberHelper.toPTBR(comparable) : comparable;

      if (this.markupGroupBatch && this.markupGroupBatch.quantity) {
        requiredValue = this.markupGroupBatch.quantity;
      }
      return { 'max': {'requiredValue': requiredValue, 'actualValue': value} };

    }
    return null;
  };

  get remainingWeightString() {
    return NumberHelper.toPTBR(this.remainingWeight);
  }

  get remainingWeight() {
    if (!this.storageUnit) {
      return 0;
    }

    return Number(
      this.storageUnit.quantity) -
    NumberHelper.fromPTBR(this.form.value.quantityString);
  }

  get locationEnabled() {
    if (!this.storageUnit)
      return false;

    if (!this.storageUnit.batches)
      return false;

    if(this.storageUnit.position.isSilo)
      return false;

    return this.storageUnit.batches.length >= 2
      || this.remainingWeight > 0;
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
    const storageUnitBatch = storageUnit.batches.find(b => b.batch.id === this.markupGroupBatch.batch.id);
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
          let firstPart = `${NumberHelper.toPTBR(i.quantityString)} (${i.sackQuantity} SC)`;
          let secondPart = `${NumberHelper.toPTBR(i.currentQuantityString)} (${this.kilosSacksConverterService.kilosToSacks(i.currentQuantity)} SC)`;
          res = `${firstPart} / ${secondPart}`;
        }
      });
    }
    return res;
  }
}
