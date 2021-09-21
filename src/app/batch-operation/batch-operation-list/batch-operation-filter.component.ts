import { ErrorHandler } from '../../shared/errors/error-handler';
import { Subscription } from 'rxjs/Rx';
import { WarehouseStakeholderAutocomplete } from '../../warehouse-stakeholder/warehouse-stakeholder-autocomplete';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Masks } from '../../shared/forms/masks/masks';
import { WarehouseStakeholder } from '../../warehouse-stakeholder/warehouse-stakeholder';
import { WarehouseStakeholderService } from '../../warehouse-stakeholder/warehouse-stakeholder.service';
import { BatchOperationStatus } from '../batch-operation-status';
import { BatchOperationFilter } from './batch-operation-filter';
import { BatchOperationType } from 'app/batch-operation/batch-operation-type';
  import { AppState } from '../../app-state.service';

@Component({
  selector: 'app-batch-operation-filter',
  templateUrl: 'batch-operation-filter.component.html'
})

export class BatchOperationFilterComponent implements OnInit, OnDestroy, OnChanges {

  @Input() loading: boolean;
  @Output() filterChange: EventEmitter<BatchOperationFilter> = new EventEmitter<BatchOperationFilter>();
  @ViewChild('statusSelect') statusSelect: any;
  @ViewChild('typeSelect') typeSelect: any;

  @Input() filterChangedData: boolean;

  form: FormGroup;

  ownerAutocomplete: WarehouseStakeholderAutocomplete;
  ownerSubscription: Subscription;

  filter: BatchOperationFilter = new BatchOperationFilter();
  dateMask = Masks.dateMask;
  integerMask = Masks.integerMask;

  private dataChanged = null;

  statuses = [
    BatchOperationStatus.OPEN,
    BatchOperationStatus.INITIED,
    BatchOperationStatus.STORED,
    BatchOperationStatus.DUMPED,
    BatchOperationStatus.AUDITING,
    BatchOperationStatus.CLOSED,
  ];

  types = [
    BatchOperationType.W_IN,
    BatchOperationType.W_OUT,
    BatchOperationType.P_IN,
    BatchOperationType.P_OUT,
    BatchOperationType.OT_IN,
    BatchOperationType.OT_OUT,
  ];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private warehouseStakeholderService: WarehouseStakeholderService,
    private errorHandler: ErrorHandler,
    private state: AppState,
  ) { }

  ngOnInit() {
    this.ownerAutocomplete = new WarehouseStakeholderAutocomplete(this.warehouseStakeholderService, this.errorHandler);
    this.buildForm();
  }

  ngOnDestroy() {
    if (this.ownerSubscription != null && !this.ownerSubscription.closed) {
      this.ownerSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    let data: any = changes;
    if (data.filterChangedData && data.filterChangedData.currentValue) {
      this.dataChanged = data.filterChangedData.currentValue;
      this.ngOnInit();
    }
  }

  buildForm() {

    if (this.statusSelect) {
      this.statusSelect.active = null;
    }

    if (this.typeSelect) {
      this.typeSelect.active = null;
    }

    this.form = this.formBuilder.group({
      'createdDateStartString': [''],
      'createdDateEndString': [''],
      'ownerStakeholderId': [''],
      'batchOperationCode': [''],
      'sellCode': [''],
      'fiscalNote': [''],
      'type': [''],
      'status': [''],
      'batchCode': [''],
      'codeOrName': [''],
    });

    let filterData = this.state.getData('BATCH_OPERATION_FILTER');
    if (filterData) {
      this.form.patchValue(filterData);
    }
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
    this.state.setData('BATCH_OPERATION_FILTER', this.form.value);
    this.filterChange.emit(this.filter);
  }

  convertToPattern(data) {
    return data.map(item => {
      return { id: item.code, text: item.name };
    });
  }

  clear() {
    this.state.removeData('BATCH_OPERATION_FILTER');
    for (let i in this.form.controls) {
      let control = this.form.controls[i];
      control.setValue('');
    }
  }

}
