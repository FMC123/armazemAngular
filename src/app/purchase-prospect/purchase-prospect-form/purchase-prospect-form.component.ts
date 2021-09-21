import { Masks } from '../../shared/forms/masks/masks';
import { ServiceItem } from '../../service-item/service-item';
import { ServiceItemService } from '../../service-item/service-item.service';
import { ErrorHandler } from './../../shared/errors/error-handler';
import { Notification } from './../../shared/notification/notification';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseProspect } from './../purchase-prospect';
import { PurchaseProspectService } from './../purchase-prospect.service';
import { CollaboratorService } from '../../collaborator/collaborator.service';
import { CollaboratorAutocomplete } from '../../collaborator/collaborator-autocomplete';
import { UserRoutingModule } from '../../user/user-routing.module';

@Component({
  selector: 'app-purchase-prospect-form',
  templateUrl: './purchase-prospect-form.component.html'
})
export class PurchaseProspectFormComponent implements OnInit, OnDestroy {
  purchaseProspect: PurchaseProspect;
  form: FormGroup;
  loading: boolean = false;
  items: Array<ServiceItem> = [];
  integerMask = Masks.integerMask;
  decimalMask = Masks.decimalMask;
  dateMask = Masks.dateMask;
  collaboratorSubscription: Subscription;
  collaboratorAutocomplete: CollaboratorAutocomplete;

  get editing() {
    return !!this.purchaseProspect && !!this.purchaseProspect.id;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private purchaseProspectService: PurchaseProspectService,
    private itemService: ServiceItemService,
    private errorHandler: ErrorHandler,
    private collaboratorService: CollaboratorService,
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.loading = true;
    this.collaboratorAutocomplete = new CollaboratorAutocomplete(
      this.collaboratorService,
      this.errorHandler
    );

    this.route.data.forEach((data: { purchaseProspect: PurchaseProspect }) => {
      this.purchaseProspect = data.purchaseProspect;
      this.buildForm();
      this.loading = false;
    });
  }

  ngOnDestroy() {
    if (this.collaboratorSubscription != null && !this.collaboratorSubscription.closed) {
      this.collaboratorSubscription.unsubscribe();
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      code: [this.purchaseProspect.code || '', []],
      createdDateString: [
        this.purchaseProspect.createdDateString || '', []],
      contractPurchase: [this.purchaseProspect.contractPurchase || '', []],
      collaboratorId: [
        this.purchaseProspect.collaborator ?
          this.purchaseProspect.collaborator.id || '' : '',
        [Validators.required]],
      status: [this.purchaseProspect.statusObject
        ? this.purchaseProspect.statusObject.name
        : '' || '', []],
      observation: [this.purchaseProspect.observation || '', []]
    });
    this.collaboratorAutocomplete.value = this.purchaseProspect.collaborator;
    this.collaboratorSubscription = this.collaboratorAutocomplete.valueChange.subscribe((value) => {
      this.form.get('collaboratorId').setValue(value ? value.id : null);
    });
  }

  save() {
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.loading = true;
    //this.purchaseProspect.code = this.form.value.code;
    this.purchaseProspect.collaborator = this.collaboratorAutocomplete.value;
    //this.purchaseProspect.status = this.form.value.status;
    this.purchaseProspect.contractPurchase = this.form.value.contractPurchase;
    this.purchaseProspect.observation = this.form.value.observation;

    //TODO: corrigir:
    // if (!this.purchaseProspect.id) {
    //  const uuid = require('uuid/v4');
    //  this.purchaseProspect.id = uuid();
    //  this.purchaseProspect.createdDate = Date.now();
    //  this.purchaseProspect.status = 'Aberto';
    //}

    //this.purchaseProspect.code = this.form.value.code;
    //this.purchaseProspect.createdDate = this.form.value.createdDate;
    //this.purchaseProspect.collaborator = this.collaboratorAutocomplete.value; //this.form.value.collaborator;
    //this.purchaseProspect.status = this.form.value.status;

    return this.purchaseProspectService
      .save(this.purchaseProspect)
      .then(() => {
        Notification.success('Prospecto de compras salvo com sucesso!');
        this.router.navigate(['/purchase-prospect']);
      })
      .catch(error => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
