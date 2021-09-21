import { WarehouseStakeholderAutocomplete } from '../../warehouse-stakeholder/warehouse-stakeholder-autocomplete';
import { Subscription } from 'rxjs/Rx';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ErrorHandler } from '../../shared/errors/error-handler';
import { Masks } from '../../shared/forms/masks/masks';
import { ModalManager } from '../../shared/modals/modal-manager';
import { Notification } from '../../shared/notification';
import { WarehouseStakeholder } from '../../warehouse-stakeholder/warehouse-stakeholder';
import { WarehouseStakeholderService } from '../../warehouse-stakeholder/warehouse-stakeholder.service';
import { PackStockMovement } from '../pack-stock-movement';
import { PackStockMovementGroup } from '../pack-stock-movement-group';
import { PackStockService } from '../pack-stock.service';

const uuid = require('uuid/v4');

@Component({
  selector: 'app-pack-stock-form',
  templateUrl: 'pack-stock-form.component.html'
})

export class PackStockFormComponent implements OnInit, OnDestroy {
  group: PackStockMovementGroup;
  movement: PackStockMovement;
  form: FormGroup;
  dateMask = Masks.dateMask;
  submitted = false;
  ownerAutocomplete: WarehouseStakeholderAutocomplete;
  ownerSubscription: Subscription;

  movementFormModal = new ModalManager();
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private errorHandler: ErrorHandler,
    private service: PackStockService,
    private warehouseStakeholderService: WarehouseStakeholderService,
  ) { }

  ngOnInit() {
    Notification.clearErrors();

    this.ownerAutocomplete = new WarehouseStakeholderAutocomplete(this.warehouseStakeholderService, this.errorHandler);

    this.route.data.forEach((data: { group: PackStockMovementGroup }) => {
      this.group = data.group;
      this.buildForm();
    });
  }

  ngOnDestroy() {
    if (this.ownerSubscription != null && !this.ownerSubscription.closed) {
      this.ownerSubscription.unsubscribe();
    }
  }

  get breadcrumb() {
    const breadcrumb = [
      ['Início', ''],
      ['Estoque de Embalagens', '/pack-stock'],
    ];

    if (this.group.indStockOut) {
      breadcrumb.push(['Saída de Embalagem', null]);
    } else {
      breadcrumb.push(['Entrada de Embalagem', null]);
    }

    return breadcrumb;
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'registrationDateString': [ this.group.registrationDateString, Validators.required ],
      'ownerId': [ this.group.owner ? this.group.owner.id || '' : '', Validators.required ],
      'document': [ this.group.document, Validators.required ],
      'observation': [ this.group.observation ]
    });

    this.ownerAutocomplete.value = this.group.owner;

    this.ownerSubscription = this.ownerAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('ownerId').setValue(id);
    });
  }

  openMovementForm(movement: PackStockMovement) {
    this.movement = movement;

    if (!this.movement) {
      this.movement = new PackStockMovement();
    }

    this.movementFormModal.open(null);
  }

  addOrUpdateMovement(movement: PackStockMovement) {
    if (!movement.id && !movement.tempId) {
      movement.tempId = uuid();
      this.group.movements.push(movement);
    }
  }

  save() {
    this.submitted = true;

    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (
      !this.form.valid
      || !this.group.movements
      || !this.group.movements.length
    ) {
      return;
    }

    this.loading = true;

    this.group.registrationDateString = this.form.value.registrationDateString;
    this.group.owner = this.ownerAutocomplete.value;
    this.group.observation = this.form.value.observation;
    this.group.document = this.form.value.document;
    this.group.recordType = 'MANUAL';

    return this.service.save(this.group).then(() => {
      Notification.success('Movimentação salva com sucesso!');
      this.router.navigate(['/pack-stock']);
    }).catch((error) => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

}
