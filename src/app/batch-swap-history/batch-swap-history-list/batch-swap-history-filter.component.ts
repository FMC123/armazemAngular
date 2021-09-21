import { ErrorHandler } from '../../shared/errors/error-handler';
import { Subscription } from 'rxjs/Rx';
import { WarehouseStakeholderAutocomplete } from '../../warehouse-stakeholder/warehouse-stakeholder-autocomplete';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Masks } from '../../shared/forms/masks/masks';
import { WarehouseStakeholderService } from '../../warehouse-stakeholder/warehouse-stakeholder.service';
import { BatchSwapHistoryFilter } from './batch-swap-history-filter';
import { AppState } from '../../app-state.service';
import {BatchSwapType} from "../batch-swap-types";

@Component({
  selector: 'app-batch-swap-history-filter',
  templateUrl: 'batch-swap-history-filter.component.html',
  styleUrls: ['../../../assets/css/cafe.css']
})

export class BatchSwapHistoryFilterComponent implements OnInit, OnDestroy {

  @Input() loading: boolean;
  @Output() filterChange: EventEmitter<BatchSwapHistoryFilter> = new EventEmitter<BatchSwapHistoryFilter>();
  @ViewChild('typeSelect') typeSelect: any;

  form: FormGroup;

  clientAutocomplete: WarehouseStakeholderAutocomplete;
  clientSubscription: Subscription;

  filter: BatchSwapHistoryFilter = new BatchSwapHistoryFilter();
  dateMask = Masks.dateMask;

  types = BatchSwapType.list();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private warehouseStakeholderService: WarehouseStakeholderService,
    private errorHandler: ErrorHandler,
    private state: AppState,
  ) { }

  ngOnInit() {
    this.clientAutocomplete = new WarehouseStakeholderAutocomplete(this.warehouseStakeholderService, this.errorHandler);
    this.buildForm();
  }

  ngOnDestroy() {
    if (this.clientSubscription != null && !this.clientSubscription.closed) {
      this.clientSubscription.unsubscribe();
    }
  }

  buildForm(clear?: boolean) {

    if (this.typeSelect) {
      this.typeSelect.active = null;
    }

    let auxFilter = (clear === true) ? false : this.state.getFilter('BATCH_SWAP_HISTORY_FILTER');
    this.form = this.formBuilder.group({
      'createdDateStartString': [(auxFilter && auxFilter.value) ? auxFilter.value.createdDateStartString : ''],
      'createdDateEndString': [(auxFilter && auxFilter.value) ? auxFilter.value.createdDateEndString : ''],
      'clientId': [(auxFilter && auxFilter.value) ? auxFilter.value.clientId : ''],
      // 'userName': [(auxFilter && auxFilter.value) ? auxFilter.value.userName : ''],
      'type': [(auxFilter && auxFilter.value) ? auxFilter.value.type : ''],
      // 'tagCode': [(auxFilter && auxFilter.value) ? auxFilter.value.tagCode : ''],
      'originBatchCode': [(auxFilter && auxFilter.value) ? auxFilter.value.originBatchCode : ''],
      'destinationBatchCode': [(auxFilter && auxFilter.value) ? auxFilter.value.destinationBatchCode : ''],
    });

    this.clientAutocomplete.value = null;

    this.clientSubscription = this.clientAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('clientId').setValue(id);
    });

  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.filter = BatchSwapHistoryFilter.fromData(this.form.value);
    this.state.setFilter('BATCH_SWAP_HISTORY_FILTER', this.filter);
    this.filterChange.emit(this.filter);
  }

  refreshValues(data, key) {
    if (!data || data.length === 0) {
      this.form.controls[key].setValue(null);
      return;
    }

    this.form.controls[key].setValue(data.map(d => d.id));
  }

  convertToNgSelect(data) {
    return data.map(item => {
      return { id: item.code, text: item.name };
    });
  }
}
