import { Person } from '../../person/person';
import { ServiceItem } from '../../service-item/service-item';
import { ServiceItemService } from '../../service-item/service-item.service';
import { ServiceGroupService } from '../../service-group/service-group.service';
import { ServiceGroup } from '../../service-group/service-group';
import { Subscription } from 'rxjs/Rx';
import { WarehouseStakeholderService } from '../warehouse-stakeholder.service';
import { WarehouseStakeholder } from '../warehouse-stakeholder';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Masks } from './../../shared/forms/masks/masks';
import { ErrorHandler } from './../../shared/errors/error-handler';
import { ModalManager } from './../../shared/modals/modal-manager';
import { AuthService } from './../../auth/auth.service';
import { Notification } from './../../shared/notification/notification';


@Component({
  selector: 'app-warehouse-stakeholder-form',
  templateUrl: './warehouse-stakeholder-form.component.html',
})
export class WarehouseStakeholderFormComponent implements OnInit, OnDestroy {

  warehouseStakeholder: WarehouseStakeholder;
  form: FormGroup;
  loading: boolean = false;
  editing: boolean = false;
  codeChangeAlert: ModalManager = new ModalManager();
  submitted: boolean = false;
  ufSubscription: Subscription;
  serviceGroups: Array<ServiceGroup>;
  integerMask = Masks.integerMask;
  decimalMask = Masks.decimalMask;
  serviceItens: Array<ServiceItem>;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private warehouseStakeholderService: WarehouseStakeholderService,
    private errorHandler: ErrorHandler,
    private serviceGroupService: ServiceGroupService,
    private itemService: ServiceItemService,
  ) { }

  ngOnInit() {
    Notification.clearErrors();

    this.route.data.forEach((data: { warehouseStakeholder: WarehouseStakeholder }) => {
      this.warehouseStakeholder = data.warehouseStakeholder;
    });
    this.serviceGroupService.list().then((serviceGroups: Array<ServiceGroup>) => {
      this.serviceGroups = serviceGroups;
    });

    this.itemService.listToServiceInstruction().then((serviceItens: Array<ServiceItem>) => {
      this.serviceItens = serviceItens;
    });

    this.buildForm();
  }

  get newStakeholderLobby() {
    if (this.auth.hasPermission('WAREHOUSE_STAKEHOLDER_NEW')) {
      return true;
    }
    return false;
  }


  ngOnDestroy() {
    if (this.ufSubscription && !this.ufSubscription.closed) {
      this.ufSubscription.unsubscribe();
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      'code': [this.warehouseStakeholder.code || ''],
      'personId': [this.warehouseStakeholder.person ? this.warehouseStakeholder.person.id || '' : '', [Validators.required]],
      'chargeType': [this.warehouseStakeholder.chargeType ? this.warehouseStakeholder.chargeType : false],
      'generateCharging': [this.warehouseStakeholder.generateCharging ? this.warehouseStakeholder.generateCharging : false],
      'inChargePeriodGrace': [this.warehouseStakeholder.inChargePeriodGrace || ''],
      'rebenefitChargePeriodGrace': [this.warehouseStakeholder.rebenefitChargePeriodGrace || ''],
      'observation1': [this.warehouseStakeholder.observation1 || ''],
      'observation2': [this.warehouseStakeholder.observation2 || ''],
      'observation3': [this.warehouseStakeholder.observation3 || ''],
      'gsSampleQty': [this.warehouseStakeholder.gsSampleQty || ''],
      'inSampleQty': [this.warehouseStakeholder.inSampleQty || ''],
      'outSampleQty': [this.warehouseStakeholder.outSampleQty || ''],
      'chargePackLoadUnload': [this.warehouseStakeholder.chargePackLoadUnload ? this.warehouseStakeholder.chargePackLoadUnload : false],
      'storageService': [this.warehouseStakeholder.storageService ? this.warehouseStakeholder.storageService.id : ''],
      'rentService': [this.warehouseStakeholder.rentService ? this.warehouseStakeholder.rentService.id : ''],
      'insuranceService': [this.warehouseStakeholder.insuranceService ? this.warehouseStakeholder.insuranceService.id : ''],
      'storageServiceCarencia': [this.warehouseStakeholder.storageServiceCarencia ?
        this.warehouseStakeholder.storageServiceCarencia.id : ''],
      'insuranceServiceCarencia': [this.warehouseStakeholder.insuranceServiceCarencia ?
        this.warehouseStakeholder.insuranceServiceCarencia.id : ''],
      'serviceGroup': [this.warehouseStakeholder.serviceGroup ? this.warehouseStakeholder.serviceGroup.id : ''],
      'checkServiceGuideClosing': [this.warehouseStakeholder.checkServiceGuideClosing ?
        this.warehouseStakeholder.checkServiceGuideClosing : false],
    });
  }

  save() {
    this.submitted = true;
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }
    this.loading = true;
    this.warehouseStakeholder.code = this.form.value.code;
    this.warehouseStakeholder.person = new Person();
    this.warehouseStakeholder.person.id = this.form.value.personId;
    this.warehouseStakeholder.chargeType = this.form.value.chargeType;
    this.warehouseStakeholder.generateCharging = this.form.value.generateCharging;
    this.warehouseStakeholder.inChargePeriodGrace = this.form.value.inChargePeriodGrace;
    this.warehouseStakeholder.rebenefitChargePeriodGrace = this.form.value.rebenefitChargePeriodGrace;
    this.warehouseStakeholder.observation1 = this.form.value.observation1;
    this.warehouseStakeholder.observation2 = this.form.value.observation2;
    this.warehouseStakeholder.observation3 = this.form.value.observation3;
    this.warehouseStakeholder.gsSampleQty = this.form.value.gsSampleQty;
    this.warehouseStakeholder.inSampleQty = this.form.value.inSampleQty;
    this.warehouseStakeholder.outSampleQty = this.form.value.outSampleQty;
    this.warehouseStakeholder.chargePackLoadUnload = this.form.value.chargePackLoadUnload;
    this.warehouseStakeholder.storageService = new ServiceItem(this.form.value.storageService);
    this.warehouseStakeholder.rentService = new ServiceItem(this.form.value.rentService);
    this.warehouseStakeholder.insuranceService = new ServiceItem(this.form.value.insuranceService);
    this.warehouseStakeholder.storageServiceCarencia = new ServiceItem(this.form.value.storageServiceCarencia);
    this.warehouseStakeholder.insuranceServiceCarencia = new ServiceItem(this.form.value.insuranceServiceCarencia);
    this.warehouseStakeholder.serviceGroup = new ServiceGroup(this.form.value.serviceGroup);
    this.warehouseStakeholder.checkServiceGuideClosing = this.form.value.checkServiceGuideClosing;

    this.warehouseStakeholderService.save(this.warehouseStakeholder).then(() => {
      Notification.success('Salvo com sucesso!');
      this.router.navigate(['/warehouse-stakeholder']);
    }).catch((error) => this.handleError(error));
  }

  private handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
