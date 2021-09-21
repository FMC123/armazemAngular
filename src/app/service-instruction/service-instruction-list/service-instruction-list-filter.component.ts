import { ErrorHandler } from './../../shared/errors/error-handler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ServiceInstructionListFilter } from './service-instruction-list-filter';
import { ServiceInstructionType } from '../../service-instruction-type/service-instruction-type';
import { ServiceInstructionTypeService } from '../../service-instruction-type/service-instruction-type.service';
import { ServiceInstructionStatus } from './../service-instruction-status';
@Component({
  selector: 'app-service-instruction-list-filter',
  templateUrl: 'service-instruction-list-filter.component.html'
})
export class ServiceInstructionListFilterComponent implements OnInit {
  @Input() loading: boolean;
  @Output()
  filterChange: EventEmitter<ServiceInstructionListFilter> = new EventEmitter<
    ServiceInstructionListFilter
  >();

  form: FormGroup;
  filter: ServiceInstructionListFilter = new ServiceInstructionListFilter();
  types: Array<ServiceInstructionType> = [];
  statusList: Array<ServiceInstructionStatus> = ServiceInstructionStatus.list();

  constructor(private formBuilder: FormBuilder,
    private errorHandler: ErrorHandler,
    private serviceInstructionTypeService: ServiceInstructionTypeService) {
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      codeOrName: [''],
      typeId: [''],
      batchCode: [''],
      status: [''],
      includeClosedOrCancelled: [false]
    });

    this.serviceInstructionTypeService.list().then(types => {
      this.types = types;
    }).catch(error => this.handleError(error));
  }

  submit() {
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.filter = ServiceInstructionListFilter.fromData(this.form.value);
    this.filterChange.emit(this.filter);
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}