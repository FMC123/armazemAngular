import { ErrorHandler } from '../../shared/errors/error-handler';
import { Subscription } from 'rxjs/Rx';
import { WarehouseStakeholderAutocomplete } from '../../warehouse-stakeholder/warehouse-stakeholder-autocomplete';
import { WarehouseStakeholder } from '../../warehouse-stakeholder/warehouse-stakeholder';
import { WarehouseStakeholderService } from '../../warehouse-stakeholder/warehouse-stakeholder.service';
import { PackTypeService } from '../../pack-type/pack-type.service';
import { ActivatedRoute } from '@angular/router';
import { Masks } from '../../shared/forms/masks/masks';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PackStockFilter } from './pack-stock-filter';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-pack-stock-list-filter',
  templateUrl: 'pack-stock-list-filter.component.html'
})

export class PackStockListFilterComponent implements OnInit, OnDestroy {

  @Input() loading: boolean;
  @Output() filterChange: EventEmitter<PackStockFilter> = new EventEmitter<PackStockFilter>();
  @ViewChild('packTypesInput')
  packTypesInput: any;

  packTypeOptions: Array<{id: string, text: string}>;
  stakeholders: Array<WarehouseStakeholder>;
  packTypeIds: Array<string>;
  ngSelectClearfix = true;

  form: FormGroup;

  filter: PackStockFilter = new PackStockFilter();
  dateMask = Masks.dateMask;
  ownerAutocomplete: WarehouseStakeholderAutocomplete;
  ownerSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private packTypeService: PackTypeService,
    private warehouseStakeholderService: WarehouseStakeholderService,
    private errorHandler: ErrorHandler,
  ) {}

  ngOnInit() {
    this.packTypeService.list().then(packTypes => {
      this.packTypeOptions = packTypes
        .filter(pt => !!pt.trackStock)
        .map(pt => {
          return {
            id: pt.id,
            text: pt.description,
          };
        });
    });

    this.ownerAutocomplete = new WarehouseStakeholderAutocomplete(this.warehouseStakeholderService, this.errorHandler);

    this.buildForm();
  }

  ngOnDestroy() {
    if (this.ownerSubscription != null && !this.ownerSubscription.closed) {
      this.ownerSubscription.unsubscribe();
    }
  }

  buildForm() {
    if (this.packTypesInput) {
      this.packTypesInput.active = null;
    }

    this.form = this.formBuilder.group({
      'registrationDateStartString': [''],
      'registrationDateEndString': [''],
      'ownerId': [''],
      'packTypeIds': [''],
    });

    this.ownerAutocomplete.value = null;

    this.ownerSubscription = this.ownerAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('ownerId').setValue(id);
    });
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.filter = PackStockFilter.fromData(this.form.value);
    this.filter.packTypeIds = this.packTypeIds;
    this.filterChange.emit(this.filter);
  }

  refreshPackTypes(data) {
    if (!data) {
      this.filter.packTypeIds = null;
      return;
    }

    this.packTypeIds = data.map(d => d.id);
  }

}
