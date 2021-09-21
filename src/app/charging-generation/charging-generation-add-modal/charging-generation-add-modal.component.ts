import { Masks } from 'app/shared/forms/masks/masks';
import { Focusable } from '../../shared/forms/focusable/focusable.directive';
import { Component, EventEmitter, Input, OnInit, Output, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorHandler } from 'app/shared/errors/error-handler';
import { ServiceChargeService } from 'app/service-charge/service-charge.service';
import { ServiceCharge } from 'app/service-charge/service-charge';
import { WarehouseStakeholder } from 'app/warehouse-stakeholder/warehouse-stakeholder';
import { ServiceItem } from 'app/service-item/service-item';
import { ServiceItemService } from 'app/service-item/service-item.service';

@Component({
  selector: 'app-charging-generation-add-modal',
  templateUrl: './charging-generation-add-modal.component.html'
})
export class ChargingGenerationAddModalComponent implements OnInit {

  @Output() close: EventEmitter<ServiceCharge> = new EventEmitter<ServiceCharge>();
  @ViewChildren(Focusable) focusables;
  @Input() clients: WarehouseStakeholder[];

  services: ServiceItem[];
  decimalMask = Masks.decimalMask5Digits;
  integerMask = Masks.integerMask;
  dateMask = Masks.dateMask;
  form: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private service: ServiceChargeService,
    private errorHandler: ErrorHandler,
    private itemService: ServiceItemService
  ) { }

  ngOnInit() {

    this.itemService.listToServiceCharge().then((serviceItens: Array<ServiceItem>) => {
      this.services = serviceItens;
    });

    this.buildForm();
  }

  focusOnInput() {
    return () => {
      if (this.focusables && this.focusables.length > 0) {
        this.focusables.first.focus();
      }
    };
  }

  buildForm() {
    this.form = this.formBuilder.group({
      stakeholderId: ['', Validators.required],
      serviceItemId: ['', Validators.required],
      price: ['', Validators.required],
      referenceDate: ['', Validators.required],
      observation: [''],
    });
  }

  clearForm() {
    this.buildForm();
  }

  submit() {

    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    let sc = new ServiceCharge();
    sc.owner = new WarehouseStakeholder(this.form.value.stakeholderId);
    sc.serviceItem = new ServiceItem(this.form.value.serviceItemId);
    sc.priceString = this.form.value.price;
    sc.referenceDateString = this.form.value.referenceDate;
    sc.observation = this.form.value.observation;

    this.loading = true;
    this.service.save(sc).then(sc => {

      this.loading = false;
      this.close.emit(sc);

    }).catch((error) => {
      this.loading = false;
      this.errorHandler.fromServer(error);
    });
  }
}