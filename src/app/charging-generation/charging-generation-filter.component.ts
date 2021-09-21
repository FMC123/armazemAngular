import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Masks } from 'app/shared/forms/masks/masks';
import { Forklift } from 'app/forklift/forklift';
import { ChargingGenerationFilter } from './charging-generation-filter';
import { WarehouseStakeholderAutocomplete } from 'app/warehouse-stakeholder/warehouse-stakeholder-autocomplete';
import { Subscription } from 'rxjs';
import { WarehouseStakeholderService } from 'app/warehouse-stakeholder/warehouse-stakeholder.service';
import { Notification } from './../shared/notification/notification';
import { ErrorHandler } from './../shared/errors/error-handler';
import { WarehouseStakeholder } from 'app/warehouse-stakeholder/warehouse-stakeholder';
import { ModalManager } from "app/shared/shared.module";

@Component({
  selector: 'app-charging-generation-filter',
  templateUrl: 'charging-generation-filter.component.html'
})

export class ChargingGenerationFilterComponent implements OnInit {
  @Input() loading: boolean;
  @Output() filterChange = new EventEmitter<ChargingGenerationFilter>();
  @Output() refresh = new EventEmitter<any>();

  form: FormGroup;
  forklifts: Array<Forklift>;

  // lista de clientes selecionados
  clients: Array<WarehouseStakeholder> = [];

  filter = new ChargingGenerationFilter();
  integerMask = Masks.integerMask;
  dateMask = Masks.dateMask;
  decimalMask = Masks.decimalMask;

  ownerAutocomplete: WarehouseStakeholderAutocomplete;
  ownerSubscription: Subscription;
  addChargeModal = new ModalManager();

  chargedTypes = [
    { code: "", name: "Ambos" },
    { code: "true", name: "Sim" },
    { code: "false", name: "Não" }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private warehouseStakeholderService: WarehouseStakeholderService,
    private errorHandler: ErrorHandler
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.ownerAutocomplete = new WarehouseStakeholderAutocomplete(this.warehouseStakeholderService, this.errorHandler);
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'createdDateStartString': ['', [Validators.required]],
      'createdDateEndString': ['', [Validators.required]],
      'stakeholderId': [''],
      'charged':[null],
      'reprocess':[false],
    });

    this.ownerAutocomplete.value = '';
    this.ownerSubscription = this.ownerAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('stakeholderId').setValue(id);

      // adiciona cliente na lista e limpa busca de clientes
      if (value != null) {
        this.addClient(value);
        this.ownerAutocomplete.value = null;
      }
    });
  }

  /**
   * Adiciona cliente selecionado na listagem (não pode repetir)
   *
   * @param client
   */
  addClient(client: WarehouseStakeholder) {

    if (client == null || client == undefined) {
      return;
    }

    // verifica se já está lista
    let exist = false;
    for (const c of this.clients) {
      if (c.id == client.id) {
        exist = true;
        break;
      }
    }

    if (!exist) {
      this.clients.push(client);
    }
  }

  /**
   * Rremove cliente da lista
   * @param id
   */
  removeClient(id: string) {

    let pos = -1;

    for (let i = 0; i < this.clients.length; i++) {
      this.clients[i].id == id;
      pos = i;
      break;
    }

    if (pos > -1) {
      this.clients.splice(pos, 1);
    }
  }

  submit() {

    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.filter.charged = this.form.value.charged === "" ? null : this.form.value.charged === "true";
    console.log(this.form.value.reprocess);
    this.filter.reprocess = this.form.value.reprocess;



    this.filter.createdDateStartString = this.form.value.createdDateStartString;
    this.filter.createdDateEndString = this.form.value.createdDateEndString;
    this.filter.stakeholders = this.clients;

    this.filterChange.emit(this.filter);
  }

  addChargeModalClose() {
    (<any>jQuery)('.modal').modal('hide');
    this.addChargeModal.close();
    //this.refresh.emit('refresh');
  }
}
