import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorHandler } from 'app/shared/errors/error-handler';
import { Tag } from 'app/tag/tag';
import { Subscription } from 'rxjs/Rx';

import { AuthService } from '../../../auth/auth.service';
import { Batch } from '../../../batch/batch';
import { PositionSacaria } from '../../../position/sacaria/position-sacaria';
import { Position } from '../../../position/position';
import { PositionSacariaService } from '../../../position/sacaria/position-sacaria.service';
import { Masks } from '../../../shared/forms/masks/masks';
import { StackService } from '../../../stack/stack.service';
import { StorageUnitService } from '../../storage-unit.service';
import { StorageUnitBatch } from '../../storage-unit-batch';
import { StorageUnit } from '../../storage-unit';
import { CustomValidators } from '../../../shared/forms/validators/custom-validators';
import { Notification } from '../../../shared/notification/notification';

@Component({
  selector: 'app-storage-unit-sacaria-form-modal',
  templateUrl: 'storage-unit-sacaria-form-modal.component.html'
})

export class StorageUnitSacariaFormModalComponent implements OnInit {
  @Input() batch: Batch;
  @Output() close = new EventEmitter();

  storageUnitBatch: StorageUnitBatch;
  form: FormGroup;
  loading = false;
  positions: Array<PositionSacaria>;
  integerMask = Masks.integerMask;

  constructor(
    private auth: AuthService,
    private service: StorageUnitService,
    private positionSacariaService: PositionSacariaService,
    private storageUnitService: StorageUnitService,
    private stackService: StackService,
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandler,
  ) { }

  ngOnInit() {
    this.positionSacariaService.list().then(positions => {
      this.positions = positions;
    });

    this.loading = true;
    this.loadStorageUnitBatch().then(() => {
      this.buildForm();
      this.loading = false;
    });
  }

  loadStorageUnitBatch() {
    return this.storageUnitService.listByBatch(this.batch.id).then((storageUnits) => {
      if (storageUnits && storageUnits.length) {
        this.storageUnitBatch = storageUnits[0].batches[0];
        this.storageUnitBatch.storageUnit = new StorageUnit();
        this.storageUnitBatch.storageUnit.position = storageUnits[0].position;
      } else {
        this.storageUnitBatch = new StorageUnitBatch();
        this.storageUnitBatch.batch = this.batch;
        this.storageUnitBatch.storageUnit = new StorageUnit();
      }
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'positionId': [this.storageUnitBatch.storageUnit.position ? this.storageUnitBatch.storageUnit.position.id || '' : '', [ Validators.required ]],
      'quantity': [this.storageUnitBatch.quantity || 0, [ Validators.required, CustomValidators.minValidator(1) ]],
    });
  }

  save() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.loading = true;

    this.storageUnitBatch.storageUnit.position = new Position(this.form.value.positionId);
    this.storageUnitBatch.quantity = this.form.value.quantity;

    return this.service.saveSacaria(this.storageUnitBatch).then(() => {
      Notification.clearErrors();
      Notification.success('Unidade de armazenamento salva com sucesso!');
      this.loading = false;
      (<any>jQuery)('.modal').modal('hide');
    }).catch((error) => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
