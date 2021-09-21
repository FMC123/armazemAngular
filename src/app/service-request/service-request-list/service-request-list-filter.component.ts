import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ServiceRequestListFilter } from './service-request-list-filter';
import { ServiceRequestType } from '../service-request-type';
import { ServiceRequestStatus } from '../service-request-status';

@Component({
  selector: 'app-service-request-list-filter',
  templateUrl: 'service-request-list-filter.component.html'
})
export class ServiceRequestListFilterComponent implements OnInit {
  @Input() loading: boolean;
  @Output()
  filterChange: EventEmitter<ServiceRequestListFilter> = new EventEmitter<
    ServiceRequestListFilter
    >();

  form: FormGroup;
  filter: ServiceRequestListFilter = new ServiceRequestListFilter();
  types: Array<ServiceRequestType> = ServiceRequestType.list();
  statusList: Array<ServiceRequestStatus> = ServiceRequestStatus.list();


  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      codeOrBatch: [''],
      type: [''],
      status: ['']
    });
  }

  submit() {
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.filter = ServiceRequestListFilter.fromData(this.form.value);
    this.filterChange.emit(this.filter);
  }
}
