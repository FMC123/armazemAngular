import { Notification } from '../../../shared/notification';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChildren, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BatchService } from 'app/batch/batch.service';
import { BatchAutocomplete } from 'app/batch/batch-autocomplete';
import { Subscription } from 'rxjs';
import { Focusable } from 'app/shared/forms/focusable/focusable.directive';
import { StorageUnit } from 'app/storage-unit/storage-unit';
import { StorageUnitBatch } from 'app/storage-unit/storage-unit-batch';
import { Batch } from 'app/batch/batch';
import { AuthService } from 'app/auth/auth.service';
import { StorageUnitService } from 'app/storage-unit/storage-unit.service';
import { ErrorHandler } from 'app/shared/errors/error-handler';
import { StorageUnitMergeService } from 'app/storage-unit/merge/storage-unit-merge.service';

@Component({
  selector: 'app-storage-unit-merge-form',
  templateUrl: 'storage-unit-merge-form.component.html'
})

export class StorageUnitMergeFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  storageUnits: Array<StorageUnitBatch>;

  constructor(
    private auth: AuthService,
    private service: StorageUnitMergeService,
    private storageUnitService: StorageUnitService,
    private batchService: BatchService,
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandler,
  ) { }

  get batch() {
    return this.service.batch;
  }

  get storageUnitsFrom() {
    if (!this.form || !this.form.value.storageUnitToId) {
      return this.storageUnits;
    }

    return this.storageUnits.filter(su => su.id !== this.form.value.storageUnitToId);
  }

  get storageUnitsTo() {
    if (!this.form || !this.form.value.storageUnitFromId) {
      return this.storageUnits;
    }

    return this.storageUnits.filter(su => su.id !== this.form.value.storageUnitFromId);
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.loading = true;

    this.storageUnitService
      .listByBatch(this.batch.id)
      .then((storageUnits) => {
        this.storageUnits = storageUnits;
        this.buildForm();
        this.loading = false;
      })
      .catch((error) => this.handleError(error));
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'storageUnitFromId': ['', [ Validators.required ]],
      'storageUnitToId': ['', [ Validators.required ]],
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

    return this.storageUnitService.merge(
      this.batch.id,
      this.form.value.storageUnitFromId,
      this.form.value.storageUnitToId
    ).then(() => {
      Notification.clearErrors();
      Notification.success('Unidades de armazenamento mescladas com sucesso!');
      this.refresh();
    }).catch((error) => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
