import { Component, EventEmitter, Input, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ErrorHandler } from './../../shared/errors/error-handler';
import { Notification } from './../../shared/notification/notification';
import { Subscription } from 'rxjs/Rx';
import { Masks } from './../../shared/forms/masks/masks';
import { PurchaseProspect } from './../purchase-prospect';
import { Batch } from '../../batch/batch';
import { BatchService } from '../../batch/batch.service';
import { Drink } from '../../drink/drink';
import { DrinkService } from '../../drink/drink.service';
import { Strainer } from '../../strainer/strainer';
import { StrainerService } from '../../strainer/strainer.service';
import { ClassificationType } from '../../classification/classification-type';
import { ClassificationValue } from '../../classification/classification-value';
import { ClassificationService } from '../../classification/classification.service';

@Component({
  selector: 'app-purchase-prospect-batchs',
  templateUrl: './purchase-prospect-batchs.component.html'
})
export class PurchaseProspectBatchsComponent implements OnInit {

  @Input('editable') editable: boolean = false;
  @Input('purchaseProspect') purchaseProspect: PurchaseProspect;

  form: FormGroup;
  loading: boolean = false;
  integerMask = Masks.integerMask;
  batchEditing: Batch;

  get editing() {
    return !!this.purchaseProspect && !!this.purchaseProspect.id;
  }

  constructor(
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandler
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.loading = true;
    this.buildForm(new Batch());
  }

  buildForm(batch: Batch) {
    this.form = this.formBuilder.group({
      batchCode: [batch
        ? batch.batchCode : '', [Validators.required]],
      netQuantity: [batch.netQuantity || '', Validators.required],
    });
  }

  save() {

    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }

    let batch = (this.batchEditing)
      ? this.batchEditing
      : new Batch();
    batch.batchCode = this.form.value.batchCode;
    batch.netQuantity = this.form.value.netQuantity;

    if (!this.batchEditing) {
      if (!this.purchaseProspect.batchOperation.batches)
        this.purchaseProspect.batchOperation.batches = [];
      this.purchaseProspect.batchOperation.batches.push(batch);
    }
    this.batchEditing = null;
    this.buildForm(new Batch());
  }

  edit(batch: Batch) {
    this.batchEditing = batch;
    this.buildForm(this.batchEditing);
  }

  remove(batch: Batch) {
    const index = this.purchaseProspect.batchOperation.batches.indexOf(batch);
    if (index > -1) {
      this.purchaseProspect.batchOperation.batches.splice(index, 1);
    }
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

}
