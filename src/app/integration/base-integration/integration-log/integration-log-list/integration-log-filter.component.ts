import { Component, OnInit, Input, Output, OnDestroy, EventEmitter }      from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Masks } from 'app/shared/forms/masks/masks';
import { CustomValidators } from 'app/shared/forms/validators/custom-validators';
import { IntegrationLogDirection } from '../integration-log-direction';
import { IntegrationLogIntegrationType } from '../integration-log-integrationType';
import { IntegrationLogStatus } from '../integration-log-status';
import { IntegrationLogFilter } from '../integration-log.filter';
import { FunctionLogService } from '../integration-log.service';

@Component({
  selector: 'app-integration-log-filter',
  templateUrl: './integration-log-filter.component.html'
})
export class IntegrationLogFilterComponent implements OnInit {
  @Input() loading: boolean;
  @Output() filterChange: EventEmitter<IntegrationLogFilter> = new EventEmitter<IntegrationLogFilter>();

  form: FormGroup;
  filter: IntegrationLogFilter = new IntegrationLogFilter();
  integerMask: any = Masks.integerMask;
  dateTimeMask: any = Masks.dateTimeMask;
  dateMask: any = Masks.dateMask;
  decimalMask: any = Masks.decimalMask;
  integrated: any = false;
  listStatus: Array<IntegrationLogStatus> = [];
  selectedStatus: string;
  listDirection: IntegrationLogDirection[];
  selectedDirection: string;
  listUrl: Array<string> = [];
  selectedUrl: string;
  selectedIntegrationType: string;
  listIntegrationType: IntegrationLogIntegrationType[];
  integrationContent: string;
  monthLast: any;

  constructor(
    private formBuilder: FormBuilder,
    private integrationLogService: FunctionLogService
  ) {}

  ngOnInit() {
    this.listStatus = IntegrationLogStatus.list();
    this.listDirection = IntegrationLogDirection.list();
    this.listIntegrationType = IntegrationLogIntegrationType.list();
    this.integrationLogService.urlList().then((minhaurl: Array<any>) => {
      this.listUrl = minhaurl;
		});
    this.lastMonth();
    this.buildForm();
    this.submit();
  }


  buildForm() {
    this.form = this.formBuilder.group({
      'selectedUrl': [''],
      'selectedStatus': [''],
      'selectedDirection': [''],
      'selectedIntegrationType': [''],
      'integrated': [''],
      'initialCreatedDateString': [this.monthLast ||
        '',
        [ CustomValidators.dateValidator(), Validators.required ]
      ],
      'finalCraetedDateString': [
        '',
        [ CustomValidators.dateValidator() ]
      ],
      'integrationContent': [''],
    });
  }

  checked() {
    if(this.integrated == true){
      this.integrated = false;
    }else{
      this.integrated = true;
    }
  }

  lastMonth(){
    let dataAtual = new Date();
    this.monthLast  = ((dataAtual.getDate() )) + "/" + ((dataAtual.getMonth() -1)) + "/" + dataAtual.getFullYear();
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }


    if(this.form.value.initialCreatedDateString == ""){
      this.form.value.initialCreatedDateString = this.monthLast;
    }

    this.filter = new IntegrationLogFilter();
    this.filter.url = this.form.value.selectedUrl;
    this.filter.status = this.form.value.selectedStatus;
    this.filter.direction = this.form.value.selectedDirection;
    this.filter.integrationType = this.form.value.selectedIntegrationType;
    this.filter.integrated = this.integrated;
    this.filter.initialCreatedDateString = this.form.value.initialCreatedDateString;
    this.filter.finalCreatedDateString = this.form.value.finalCraetedDateString;
    this.filter.integrationContent = this.form.value.integrationContent;
    this.filterChange.emit(this.filter);
  }

}
