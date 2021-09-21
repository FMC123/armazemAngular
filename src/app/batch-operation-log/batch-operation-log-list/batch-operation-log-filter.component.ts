import { ErrorHandler } from '../../shared/errors/error-handler';
import { Subscription } from 'rxjs/Rx';
import { WarehouseStakeholderAutocomplete } from '../../warehouse-stakeholder/warehouse-stakeholder-autocomplete';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { BatchOperationFilter } from '../../batch-operation/batch-operation-list/batch-operation-filter';
import { BatchOperationStatus } from '../../batch-operation/batch-operation-status';
import { Masks } from '../../shared/forms/masks/masks';
import { WarehouseStakeholder } from '../../warehouse-stakeholder/warehouse-stakeholder';
import { WarehouseStakeholderService } from '../../warehouse-stakeholder/warehouse-stakeholder.service';

@Component({
  selector: 'app-batch-operation-log-filter',
  templateUrl: 'batch-operation-log-filter.component.html'
})

export class BatchOperationFilterLogComponent implements OnInit, OnDestroy {

  @Input() loading: boolean;
  @Output() filterChange: EventEmitter<BatchOperationFilter> = new EventEmitter<BatchOperationFilter>();

  form: FormGroup;

  ownerAutocomplete: WarehouseStakeholderAutocomplete;
  ownerSubscription: Subscription;

  filter: BatchOperationFilter = new BatchOperationFilter();
  dateMask = Masks.dateMask;
  statuses = [
    BatchOperationStatus.OPEN,
    BatchOperationStatus.INITIED,
    BatchOperationStatus.STORED,
    BatchOperationStatus.CLOSED,
  ];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private warehouseStakeholderService: WarehouseStakeholderService,
    private errorHandler: ErrorHandler,
  ) {}

  ngOnInit() {
    this.ownerAutocomplete = new WarehouseStakeholderAutocomplete(this.warehouseStakeholderService, this.errorHandler);
    this.buildForm();
  }

  ngOnDestroy() {
    if (this.ownerSubscription != null && !this.ownerSubscription.closed) {
      this.ownerSubscription.unsubscribe();
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'createdDateStartString': [''],
      'createdDateEndString': [''],
      'ownerStakeholderId': [''],
      'batchOperationCode': [''],
      'status': ['']
    });

    this.ownerAutocomplete.value = null;

    this.ownerSubscription = this.ownerAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('ownerStakeholderId').setValue(id);
    });
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.filter = BatchOperationFilter.fromData(this.form.value);
    this.filterChange.emit(this.filter);
  }

}
