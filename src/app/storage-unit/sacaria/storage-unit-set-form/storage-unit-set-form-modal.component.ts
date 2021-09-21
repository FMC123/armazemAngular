import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorHandler } from 'app/shared/errors/error-handler';

import { AuthService } from '../../../auth/auth.service';
import { Batch } from '../../../batch/batch';
import { PositionSacariaService } from '../../../position/sacaria/position-sacaria.service';
import { Masks } from '../../../shared/forms/masks/masks';
import { StackService } from '../../../stack/stack.service';
import { StorageUnitService } from '../../storage-unit.service';
import { StorageUnitBatch } from '../../storage-unit-batch';
import { StorageUnit } from '../../storage-unit';
import { CustomValidators } from '../../../shared/forms/validators/custom-validators';
import { Notification } from '../../../shared/notification/notification';
import {PackTypeService} from "../../../pack-type/pack-type.service";
import {PackType} from "../../../pack-type/pack-type";
import {BatchService} from "../../../batch/batch.service";

@Component({
  selector: 'app-storage-unit-set-form-modal',
  templateUrl: 'storage-unit-set-form-modal.component.html'
})

export class StorageUnitSetFormModalComponent implements OnInit {
  @Input() batch: Batch;
  @Output() close = new EventEmitter();

  storageUnitBatch: StorageUnitBatch;
  storageUnit: StorageUnit;
  form: FormGroup;
  loading = false;
  integerMask = Masks.integerMask;
  storageUnits: Array<StorageUnitBatch>;
  packTypes: Array<PackType>;

  constructor(
    private auth: AuthService,
    private service: StorageUnitService,
    private positionSacariaService: PositionSacariaService,
    private storageUnitService: StorageUnitService,
    private stackService: StackService,
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandler,
    private packTypeService: PackTypeService,
    private batchService: BatchService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadStorageUnitBatch().then(() => {
      this.buildForm();
      this.loading = false;
    });

    this.packTypeService.list().then((packTypes)=>{
      this.packTypes = packTypes
    });
  }

  loadStorageUnitBatch() {
    return this.storageUnitService.listByBatch(this.batch.id).then((storageUnits) => {
      this.storageUnits = storageUnits.filter(su => su.packType.genericType !== 'G');
      if (storageUnits && storageUnits.length) {
        this.storageUnit = storageUnits[0];
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
      'type': ['', [ Validators.required ]],
      'quantity': [this.storageUnit && this.storageUnit.packTypeQuantity || 0, [ Validators.required, CustomValidators.minValidator(1) ]],
      'indDiscountPack':[]
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
    this.batch.packType = this.packTypes.find(i => i.id == this.form.value.type);
    this.batch.indDiscountPack = this.form.value.indDiscountPack;
    this.batch.packQuantity = this.form.value.quantity;
    return this.batchService.save(this.batch).then(() => {
      Notification.clearErrors();
      Notification.success('Lote atualizado com sucesso!');
      this.loading = false;
      (<any>jQuery)('.modal').modal('hide');
    }).catch((error) => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
