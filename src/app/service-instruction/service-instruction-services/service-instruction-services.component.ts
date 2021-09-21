import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ErrorHandler} from '../../shared/errors/error-handler';
import {Subscription} from 'rxjs/Rx';
import {ServiceInstruction} from '../service-instruction';
import {ServiceItem} from '../../service-item/service-item';
import {ServiceItemService} from '../../service-item/service-item.service';
import {ServiceInstructionItem} from '../service-instruction-item';
import {Masks} from './../../shared/forms/masks/masks';
import {ServiceItemAutocomplete} from 'app/service-item/service-item-autocomplete';
import {ServiceInstructionStatus} from '../service-instruction-status';
import {CustomValidators} from 'app/shared/forms/validators/custom-validators';
import {ServiceInstructionService} from "../service-instruction.service";
import {AuthService} from "../../auth/auth.service";
import {ModalManager} from "../../shared/modals/modal-manager";

@Component({
  selector: 'app-service-instruction-services',
  templateUrl: './service-instruction-services.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ServiceInstructionServicesComponent implements OnInit, OnDestroy {
  @Input('serviceInstruction') serviceInstruction: ServiceInstruction;
  
  approveConfirm: ModalManager = new ModalManager();
  disapproveConfirm: ModalManager = new ModalManager();
  chargeMessageModal: ModalManager = new ModalManager();
  private _totalSacks: string;
  @Input() set totalSacks(value: string) {
    this._totalSacks = value
    this.buildForm(new ServiceInstructionItem());
  }

  get totalSacks() {
    return this._totalSacks;
  }

  private _subtype: string;
  @Input() set subtype(value: string) {
    this._subtype = value;
    this.validationMaxWeight();
  }

  get subtype(){
    return this._subtype;
  }



  @Input('isEditable') isEditable: boolean;
  form: FormGroup;
  @Input() loading: boolean = false;
  integerMask = Masks.integerMask;
  items: Array<ServiceItem> = [];
  serviceInstructionItemEditing: ServiceInstructionItem;

  itemsAutocomplete: ServiceItemAutocomplete;
  itemsAutocompleteSubscription: Subscription;

  get editing() {
    return !!this.serviceInstruction && !!this.serviceInstruction.id;
  }

  constructor(
    private auth: AuthService,
    private serviceInstructionService: ServiceInstructionService,
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandler,
    private itemService: ServiceItemService

  ) { }

  ngOnInit() {

    this.itemsAutocomplete = new ServiceItemAutocomplete();

    this.loading = true;
    this.itemService
      .listToServiceInstruction()
      .then(items => {
        this.items = items;
        this.itemsAutocomplete.setItems(items);
        this.buildForm(new ServiceInstructionItem());
        this.loading = false;
      }).catch(error => this.handleError(error));
  }

  ngOnDestroy() {
    this.destroyItemSubscription();
  }

  destroyItemSubscription() {
    if (this.itemsAutocompleteSubscription && !this.itemsAutocompleteSubscription.closed) {
      this.itemsAutocompleteSubscription.unsubscribe();
    }
  }

  isConfirmed() {
    return (this.serviceInstruction && this.serviceInstruction.status && this.serviceInstruction.status === ServiceInstructionStatus.CONFIRMED.code);
  }

  buildForm(serviceInstructionItem: ServiceInstructionItem) {

    // adicional de sacas somente quando confirmada
    let validatorAdditionalSacks = [ Validators.required, CustomValidators.minValidator(1) ];

    if (this.serviceInstruction && this.serviceInstruction.markupGroup) {
      validatorAdditionalSacks.push(CustomValidators.maxValidator(this.serviceInstruction.markupGroup.getTotalSacks(), this.subtype));
    }
    this.form = this.formBuilder.group({
      itemId: [serviceInstructionItem.item ? serviceInstructionItem.item.id : '', [Validators.required]],
      additionalServiceSacksQuantity : [ this.isConfirmed()
        ? serviceInstructionItem.additionalServiceSacksQuantityString
        : this.totalSacks, validatorAdditionalSacks],
      // additionalServiceSacksQuantity : [ serviceInstructionItem.additionalServiceSacksQuantity, validatorAdditionalSacks],
      chargeSacksQuantity : [serviceInstructionItem.chargeSacksQuantity, CustomValidators.minValidator(0)],
    });

    this.destroyItemSubscription();

    if(this.itemsAutocomplete)
    {
      this.itemsAutocomplete.value = serviceInstructionItem.item;
      this.itemsAutocompleteSubscription = this.itemsAutocomplete.valueChange.subscribe((value) => {
        const id = value ? value.id : null;
        this.form.get('itemId').setValue(id);
      });
    }
  }

  validateCharge(){
    let serviceSacksQuantity = parseInt(this.form.value.additionalServiceSacksQuantity);
    let chargeSacksQuantity = parseInt(this.form.value.chargeSacksQuantity);

    if(serviceSacksQuantity && chargeSacksQuantity && serviceSacksQuantity != chargeSacksQuantity){
      this.chargeMessageModal.open(null);
    } else {
      this.save(null);
    }

  }
//TO-DO
  save(chargeMessage: string) {

    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    const itemId = this.form.value.itemId;
    let service = (this.serviceInstructionItemEditing)
      ? this.serviceInstructionItemEditing
      : new ServiceInstructionItem();

    service.item = this.items.find(item => item.id === itemId);
    // sempre vai ser 1
    service.quantity = 1;
    service.additionalServiceSacksQuantityString = this.form.value.additionalServiceSacksQuantity;
    service.chargeSacksQuantityString = this.form.value.chargeSacksQuantity;
    service.chargeMessage = chargeMessage;
    // não tem mais observação
    //service.observation = this.form.value.observation;

    // se já existir serviço não pode adicionar novamente
    let alreadyAdded = false;
    if (this.serviceInstruction.services.length > 0) {
      for (const i in this.serviceInstruction.services) {
        if (this.serviceInstruction.services[i].item.id == service.item.id) {
          alreadyAdded = true;
          break;
        }
      }
    }

    if (!this.serviceInstructionItemEditing) {
      if (!alreadyAdded) {
        this.serviceInstruction.services.push(service);
      }
    }
    this.buildForm(new ServiceInstructionItem());
  }

  showApproveButton(service: ServiceInstructionItem){
    return service.chargeSacksQuantity && service.chargeSacksQuantity != service.serviceSacksQuantity;
  }

  hasAuditPermission() {
    return this.auth.hasPermission('AUDIT_CUSTOM_CHARGING') || this.auth.isAdmin;
  }

  approve(serviceInstructionItem: ServiceInstructionItem) {
    serviceInstructionItem.chargeApproved = true;
  }

  disapprove(serviceInstructionItem: ServiceInstructionItem) {
    serviceInstructionItem.chargeApproved = false;
  }

  edit(serviceInstructionItem: ServiceInstructionItem) {
    serviceInstructionItem.item =
      this.items.find( item => item.id === serviceInstructionItem.item.id);
    this.serviceInstructionItemEditing = serviceInstructionItem;
    this.buildForm(this.serviceInstructionItemEditing);
  }

  remove(serviceInstructionItem: ServiceInstructionItem) {
    const index = this.serviceInstruction.services.indexOf(serviceInstructionItem);
    if (index > -1) {
      this.serviceInstruction.services.splice(index, 1);
    }
  }

  validationMaxWeight(){
    if (this.serviceInstruction && this.serviceInstruction.markupGroup) {
      this.form.controls['additionalServiceSacksQuantity'].setValidators(
        CustomValidators.maxValidator(this.serviceInstruction.markupGroup.getTotalSacks(), this.serviceInstruction.subtype));
      this.form.get('additionalServiceSacksQuantity').setValue(this.totalSacks || 0);
    }
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  showAlertIcon(service: ServiceInstructionItem){
    return service
      && service.chargeSacksQuantity
      && service.chargeSacksQuantity != service.serviceSacksQuantity
      && service.chargeApproved === undefined
      ;
  }

  alertIconTooltip(service: ServiceInstructionItem){
    let approvalMessage = '';
    if(service.chargeApproved !== undefined){
      approvalMessage = service.chargeApproved
        ? 'Cobrança aprovada! '
        : 'Cobrança reprovada! ';
    } else {
      approvalMessage = 'Cobrança precisa ser aprovada! ';
    }
    return !this.notAutomaticApproved(service) ? 'Aprovação automática'
      : `${approvalMessage}  ${this.notAutomaticApproved(service) && service.chargeMessage ? `Motivo da cobrança: ${service.chargeMessage}` : ''}`;
  }

  approved(service: ServiceInstructionItem){
    return service.chargeApproved !== undefined && service.chargeApproved;
  }

  disapproved(service: ServiceInstructionItem){
    return service.chargeApproved !== undefined && !service.chargeApproved;
  }

  notAutomaticApproved(service: ServiceInstructionItem){
    return service.chargeSacksQuantity && service.chargeSacksQuantity != service.serviceSacksQuantity;
  }

}
