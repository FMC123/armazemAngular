import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ErrorHandler } from './../../shared/errors/error-handler';
import { Masks } from '../../shared/forms/masks/masks';
import { CarrierService } from '../../carrier/carrier.service';
import { CollaboratorService } from '../../collaborator/collaborator.service';
import { PurchaseProspectListFilter } from './purchase-prospect-list-filter';
import { CollaboratorAutocomplete } from '../../collaborator/collaborator-autocomplete';
import { Carrier } from '../../carrier/carrier';
import { PurchaseProspectStatus } from '../purchase-prospect-status';

@Component({
  selector: 'app-purchase-prospect-list-filter',
  templateUrl: 'purchase-prospect-list-filter.component.html'
})
export class PurchaseProspectListFilterComponent implements OnInit {
  @Input() loading: boolean;
  @Output()
  filterChange: EventEmitter<PurchaseProspectListFilter> = new EventEmitter<
    PurchaseProspectListFilter
    >();

  form: FormGroup;
  filter: PurchaseProspectListFilter = new PurchaseProspectListFilter();

  dateMask = Masks.dateMask;
  integerMask = Masks.integerMask;
  decimalMask = Masks.decimalMask;
  statusList = PurchaseProspectStatus.list();
  collaboratorAutocomplete: CollaboratorAutocomplete;
  carriers: Array<Carrier>;


  constructor(private formBuilder: FormBuilder,
    private errorHandler: ErrorHandler,
    private carrierService: CarrierService,
    private collaboratorService: CollaboratorService) {
  }

  ngOnInit() {
    this.loading = true;
    this.buildForm();
    this.carrierService.list().then(carriers => {
      this.carriers = carriers;

    });
    this.collaboratorAutocomplete = new CollaboratorAutocomplete(
      this.collaboratorService,
      this.errorHandler
    );
    this.loading = false;
  }

  buildForm() {
    this.form = this.formBuilder.group({
      prospect: [''],
      batchCode: [''],
      collaboratorId: [''],
      carrierId: [''],
      startDateString: [''],
      endDateString: [''],
      status: [''],
    });
  }

  submit() {
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }
    this.filter = PurchaseProspectListFilter.fromData(this.form.value);
    this.filter.collaborator = this.collaboratorAutocomplete.value;
    this.filterChange.emit(this.filter);
  }
}
