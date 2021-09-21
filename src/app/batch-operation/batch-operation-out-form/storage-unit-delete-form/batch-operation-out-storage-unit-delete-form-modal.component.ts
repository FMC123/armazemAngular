import { Notification } from '../../../shared/notification';
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

@Component({
  selector: 'app-batch-operation-out-storage-unit-delete-form-modal',
  templateUrl: './batch-operation-out-storage-unit-delete-form-modal.component.html',
})
export class BatchOperationOutStorageUnitDeleteFormModalComponent implements OnInit, OnDestroy {
  @Output() close: EventEmitter<void> = new EventEmitter<void>(false);
  @Input() storageUnitOut: StorageUnitOut;
  @ViewChildren(Focusable) focusables;
  integerMask = Masks.integerMask;
  positions: Array<Position>;
  selectedPosition: Position = new Position();
  stacks: Array<Stack>;
  form: FormGroup;
  stackSubscription: Subscription;
  loading = false;

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandler,
    private positionService: PositionService,
    private stackService: StackService,
    private storageUnitOutService: StorageUnitOutService,
  ) {}

  ngOnInit() {
    this.positionService.listByWarehouseAndType(this.auth.accessToken.warehouse.id).then(positions => {
      this.positions = positions;
    });

    this.buildForm();
  }

  ngOnDestroy() {
    [
      this.stackSubscription,
    ].forEach(subscription => {
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
      positionId: ['', [ Validators.required ]],
      stackId: ['', [ Validators.required ]],
      stackHeight: ['', [ Validators.required, CustomValidators.minValidator(1) ]],
    };

    this.form = this.formBuilder.group(group);

    this.stackSubscription = this.form.get('positionId').valueChanges.subscribe((value) => {
      if(this.positions)
        this.selectedPosition = this.positions.find(pos => pos.id === value );
      this.refreshStacks(value);
    });

    return this.refreshPosition(this.storageUnit).then(() => {
      this.loading = false;
    }).catch((error) => this.handleError(error));
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });


    if (!this.storageUnitOut.storageUnit.position.isSilo){
      this.form.get('stackId').enable();
      this.form.get('stackHeight').enable();
    } else {
      this.form.get('stackId').disable();
      this.form.get('stackHeight').disable();
    }

    if (!this.form.valid && !this.form.disabled) {
      return;
    }

    this.loading = true;

    this.storageUnitOut.storageUnit.position.id = this.form.value.positionId;

    if (!this.storageUnitOut.storageUnit.position.isSilo){
      this.storageUnitOut.storageUnit.stack.id = this.form.value.stackId;
      this.storageUnitOut.storageUnit.stackHeight = this.form.value.stackHeight;
    }

    this.storageUnitOutService.delete(this.storageUnitOut)
      .then(_ => {
        this.loading = false;
        Notification.success('Embarque da unidade de armazenamento excluído com sucesso!');
        (<any>jQuery)('.modal').modal('hide');
      })
      .catch(error => {
        this.loading = false;
        this.errorHandler.fromServer(error);
      });
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  private refreshPosition(storageUnit: StorageUnit) {
    if (!storageUnit || !storageUnit.position || !storageUnit.position.id) {
      this.form.get('positionId').setValue(null);
      this.form.get('stackId').setValue(null);
      this.form.get('stackHeight').setValue(null);
      return Promise.resolve();
    }

    this.form.get('positionId').setValue(storageUnit.position.id);

    if(!storageUnit.position.isSilo){
      this.form.get('stackId').setValue(storageUnit.stack.id);
      this.form.get('stackHeight').setValue(storageUnit.stackHeight);
    }else
      this.form.get('positionId').disable();

    this.selectedPosition = storageUnit.position;

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
}
