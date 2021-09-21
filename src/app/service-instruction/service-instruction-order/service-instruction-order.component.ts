import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {ErrorHandler} from '../../shared/errors/error-handler';
import {Subscription} from 'rxjs/Rx';
import {ServiceInstruction} from '../service-instruction';
import {ServiceItem} from '../../service-item/service-item';
import {Masks} from './../../shared/forms/masks/masks';
import {ServiceItemAutocomplete} from 'app/service-item/service-item-autocomplete';
import {CustomValidators} from 'app/shared/forms/validators/custom-validators';
import {ServiceOrder} from "../../service-order/service-order";
import {ServiceOrderService} from "../../service-order/service-order.service";
import {NumberHelper} from "../../shared/globalization";
import {Notification} from "../../shared/notification";
import {ModalManager} from "../../shared/modals/modal-manager";

@Component({
  selector: 'app-service-instruction-order',
  templateUrl: './service-instruction-order.component.html',
  styleUrls: ['service-instruction-order.component.css']
})
export class ServiceInstructionOrderComponent implements OnInit, OnDestroy {

  private _serviceInstruction: ServiceInstruction;
  @Input() set serviceInstruction(si: ServiceInstruction) {
    this._serviceInstruction = si;
    if (this.itemsAutocomplete) {
      // this.setItems();
    }
  }

  get serviceInstruction() {
    return this._serviceInstruction;
  }

  form: FormGroup;
  loading: boolean = false;
  integerMask = Masks.integerMask;

  items: Array<ServiceItem> = [];
  orderEditing: any;
  enableSave: boolean = false;

  itemsAutocomplete: ServiceItemAutocomplete;
  itemsAutocompleteSubscription: Subscription;

  confirmChargeModal: ModalManager = new ModalManager();

  constructor(
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandler,
    private orderService: ServiceOrderService
  ) {
  }

  ngOnInit() {
    this.itemsAutocomplete = new ServiceItemAutocomplete();
    this.populateOrders();
    this.buildForm();
  }

  ngOnDestroy() {
    this.destroyItemSubscription();
  }

  destroyItemSubscription() {
    if (this.itemsAutocompleteSubscription && !this.itemsAutocompleteSubscription.closed) {
      this.itemsAutocompleteSubscription.unsubscribe();
    }
  }

  setItems() {
    this.loading = true;
    this.items = [...this.serviceInstruction.services.map(s => {
      let item = Object.assign({}, s.item);
      return ServiceItem.fromData(item);
    })].filter(i => this.getAvailableSacksQuantityByServiceItem(i.id) > 0);
    this.itemsAutocomplete.setItems(this.items);
    this.loading = false;
  }

  populateOrders() {
    this.enableSave = false;
    this.orderService.listByInstruction(this.serviceInstruction.id)
      .then(serviceOrders => {
        this.serviceInstruction.serviceOrders = serviceOrders;
        this.setItems();
        this.sortOrders();
      });
  }

  sortOrders() {
    this.serviceInstruction.serviceOrders.sort((a, b) => a.service.code - b.service.code);
  }

  getTotalPaidSacksByServiceItem(serviceItemId) {
    return this.serviceInstruction.serviceOrders
      .filter(so => so.service.id === serviceItemId)
      .reduce((total, so) => total + so.sacksQuantity, 0);
  }

  getAvailableSacksQuantityByServiceItem(serviceItemId) {
    let service = Object.assign({}, this.serviceInstruction.services.find(s => s.item.id === serviceItemId));
    let totalPaidSacks = this.getTotalPaidSacksByServiceItem(serviceItemId);
    return service.serviceSacksQuantity - totalPaidSacks;
  }

  setValidators() {
    let maxValidatorNumber = this.getAvailableSacksQuantityByServiceItem(this.form.value.itemId);
    this.form.controls['additionalServiceSacksQuantity'].setValidators([
      Validators.required,
      CustomValidators.minValidator(1),
      CustomValidators.maxValidator(maxValidatorNumber)
    ]);
    this.form.controls['additionalServiceSacksQuantity'].enable();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      itemId: ['', Validators.required],
      additionalServiceSacksQuantity: [{
        value: '',
        disabled: true
      }]
    });

    this.itemsAutocomplete.value = null;
    this.itemsAutocompleteSubscription = this.itemsAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('itemId').setValue(id);
      this.form.controls['additionalServiceSacksQuantity'].setValue('');
      if (id) {
        this.setValidators();
      } else {
        this.form.controls['additionalServiceSacksQuantity'].clearValidators();
        this.form.controls['additionalServiceSacksQuantity'].disable();
      }
      this.form.controls['additionalServiceSacksQuantity'].updateValueAndValidity();

    });
  }

  clearForm() {
    this.itemsAutocomplete.value = null;
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].setValue('');
      this.form.controls[key].markAsPristine();
    });
  }

  add() {
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    const itemId = this.form.value.itemId;
    let order = (this.orderEditing) ? this.orderEditing : new ServiceOrder();

    order.service = this.items.find(item => item.id === itemId);
    order.sacksQuantity = NumberHelper.fromPTBR(this.form.value.additionalServiceSacksQuantity);
    order.editable = true;

    if (this.orderEditing) {
      let index = this.orderEditing.index;
      delete this.orderEditing.index;
      this.serviceInstruction.serviceOrders[index] = this.orderEditing;
    } else {
      this.serviceInstruction.serviceOrders.push(order);
    }
    this.orderEditing = null;
    this.clearForm();
    this.setItems();
    this.enableSave = true;
  }

  charge() {
    let dataToSave = [];
    this.serviceInstruction.serviceOrders.forEach(so => {
      if (so.editable) {
        let serviceInstructionItem = Object.assign({}, this.serviceInstruction.services
          .find(s => s.item.id === so.service.id));
        serviceInstructionItem.additionalServiceSacksQuantity = so.sacksQuantity;
        dataToSave.push(serviceInstructionItem);
      }
    });
    if (!!dataToSave.length) {
      this.orderService.save(this.serviceInstruction.id, dataToSave)
        .then(() => {
          this.populateOrders();
          Notification.success('Cobranças foram geradas com sucesso!')
        })
    } else {
      this.populateOrders();
    }
  }

  edit(so: ServiceOrder, index: number) {
    this.orderEditing = so;
    this.orderEditing.index = index;
    if (!this.items.find(i => i.id === this.orderEditing.service.id)) {
      this.items.push(this.orderEditing.service);
    }
    this.itemsAutocomplete.value = this.orderEditing.service;
    this.form.controls['itemId'].setValue(this.orderEditing.service.id);
    this.form.controls['additionalServiceSacksQuantity'].setValue(this.orderEditing.sacksQuantity);

    this.form.controls['additionalServiceSacksQuantity'].setValidators([
      Validators.required,
      CustomValidators.minValidator(1),
      CustomValidators.maxValidator(
        this.getAvailableSacksQuantityByServiceItem(this.orderEditing.service.id) +
        this.orderEditing.sacksQuantity
      )
    ]);
    this.form.controls['additionalServiceSacksQuantity'].enable();
  }

  remove(so: ServiceOrder, index: number) {
    this.serviceInstruction.serviceOrders.splice(index, 1);
    this.enableSave = this.serviceInstruction.serviceOrders.reduce((p, so) => p || so.editable, false)
    this.setItems();
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
