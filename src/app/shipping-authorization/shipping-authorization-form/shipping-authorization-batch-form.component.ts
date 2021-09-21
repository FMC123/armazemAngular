import { NumberHelper } from '../../shared/globalization';
import { CustomValidators } from '../../shared/forms/validators/custom-validators';
import { MarkupGroupBatch } from '../../markup-group/batch/markup-group-batch';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import { Batch } from '../../batch/batch';
import { BatchService } from '../../batch/batch.service';
import { Masks } from '../../shared/forms/masks/masks';
import { WarehouseStakeholder } from '../../warehouse-stakeholder/warehouse-stakeholder';
import { Notification } from './../../shared/notification/notification';
import { BatchOperation } from 'app/batch-operation/batch-operation';
import { SampleStatus } from 'app/sample/sample-status';
import { KilosSacksConverterService } from 'app/shared/kilos-sacks-converter/kilos-sacks-converter.service';
import {BatchAutocomplete} from "../../batch/batch-autocomplete";

@Component({
  selector: 'app-shipping-authorization-batch-form',
  templateUrl: './shipping-authorization-batch-form.component.html'
})
export class ShippingAuthorizationBatchFormComponent implements OnInit, OnDestroy {
  @Input() data: Array<MarkupGroupBatch> = [];
  @Input() stakeholder: AbstractControl;
  @Input() lotesDiferentesClientes: boolean;
  batches: Array<Batch> = [];

  integerMask = Masks.integerMask;
  decimalMask = Masks.decimalMask;
  form: FormGroup;
  loading: boolean = false;
  batchSubscription: Subscription;
  stakeholderSubscription: Subscription;
  buscaRealizada: boolean = false;
  sampleReserved: string = SampleStatus.RESERVED.code;
  certificates: string;
  batchSelected: Batch;

  constructor(
    private batchService: BatchService,
    private formBuilder: FormBuilder,
    private kilosSacksConverterService: KilosSacksConverterService
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.buildForm();
    this.buscarBatches();

    // quando muda o steholder, precisa buscar novamente
    this.stakeholderSubscription = this.stakeholder.valueChanges.subscribe((value) => {
      this.buscarBatches();
    });
  }

  buscarBatches() {

    // se não pode lotes com diferentes cliente precisa aguardar a seleção do cliente
    if ((this.lotesDiferentesClientes != null && this.lotesDiferentesClientes == false)
      && (this.stakeholder.value == null || this.stakeholder.value == '')) {
      return;
    }

    this.buscaRealizada = true;
    this.loading = true;

    let filter = new Batch();
    filter.batchOperation = new BatchOperation();
    filter.batchOperation.owner = new WarehouseStakeholder(this.stakeholder.value);

    this.batchService.listFilter(filter).then((batches) => {
      this.batches = batches;
      this.loading = false;
    });
  }

  ngOnDestroy() {

    if (this.batchSubscription && !this.batchSubscription.closed) {
      this.batchSubscription.unsubscribe();
    }

    if (this.stakeholderSubscription && !this.stakeholderSubscription.closed) {
      this.stakeholderSubscription.unsubscribe();
    }
  }

  buildForm() {

    this.form = this.formBuilder.group({
      'batchId': ['', Validators.required],
      'quantityString': ['', [Validators.required, CustomValidators.minValidator(1), this.maxQuantityValidator()]],
      'sacksQuantityString': ['', [Validators.required]]
    });

    if (this.batchSubscription && !this.batchSubscription.closed) {
      this.batchSubscription.unsubscribe();
    }

    // seleção do batch para adcionar aos selecionados
    this.batchSubscription = this.form.get('batchId').valueChanges.subscribe((value) => {
      this.batchSelected = this.batches.find(b => b.id === value);
      let certificates = (this.batchSelected) ? this.batchSelected.batchOperation.certificateNames : '';
      this.certificates = certificates;
      this.setQuantityAndSacks((this.batchSelected) ? this.batchSelected.availableWeight : 0);
    });
  }

  public fieldEnable() {
    return (this.batchSelected != null && this.batchSelected != undefined);
  }

  /**
   * Para definir a quantidade e calcular as sacas
   * @param quantity
   */
  setQuantityAndSacks(quantity: number) {

    if (quantity == null || quantity == undefined || isNaN(quantity) || quantity < 0) {
      quantity = 0;
    }

    let availableWeight = (quantity) ? quantity : 0;
    let sacks = (this.batchSelected) ? this.kilosSacksConverterService.kilosToSacks(quantity, this.batchSelected) : '0';

    // a quantiade de sacas deve ser de pelo menos 1, se houver algum quilo
    if (availableWeight > 0 && sacks <= 0) {
      sacks = 1;
    }

    this.form.get('quantityString').setValue(availableWeight);
    this.form.get('sacksQuantityString').setValue(sacks);
  }

  /**
   * Para definir as sacas e calcular a quantidade
   * @param sacks
   */
  setSacksAndQuantity(sacks: number) {

    if (sacks == null || sacks == undefined || isNaN(sacks) || sacks < 0) {
      sacks = 0;
    }

    let availableWeight = (this.batchSelected) ? this.kilosSacksConverterService.sacksToKilos(sacks, this.batchSelected) : '0';
    this.form.get('quantityString').setValue(availableWeight);
    this.form.get('sacksQuantityString').setValue(sacks);
  }

  maxQuantityValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!this.form) {
        return null;
      }

      const batch = this.batches.find(b => b.id === this.form.value.batchId);

      if (!batch) {
        return null;
      }

      const value = control.value;
      if (!value && value !== '0' && value !== 0) return;
      if (NumberHelper.fromPTBR(value) > batch.availableWeight) {
        let requiredValue = batch.availableWeight % 1 !== 0 ? NumberHelper.toPTBR(batch.availableWeight) : batch.availableWeight;
        return { 'max': { 'requiredValue': requiredValue, 'actualValue': value } };
      }
      return null;
    };
  }

  get filteredData() {
    return this.data;
  }

  get availableBatches() {
    const notInList = (u) => {
      let alreadyInList = this.data.some((au) => au.batch.id === u.id);
      return !alreadyInList;
    };

    return this.batches
      .filter(notInList);
  }

  get noFunds() {
    return (this.buscaRealizada &&
      (!this.filteredData || !this.filteredData.length) && (!this.availableBatches || !this.availableBatches.length));
  }

  add() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    let batchId = this.form.value.batchId;
    let quantityString = this.form.value.quantityString;
    let markupGroupBatch = new MarkupGroupBatch();
    markupGroupBatch.batch = this.batches.filter((u) => u.id === batchId)[0];
    markupGroupBatch.quantityString = quantityString;
    this.data.push(markupGroupBatch);
    this.buildForm();
  }

  remove(batchId: string) {
    let index = this.data.findIndex((wu) => wu.batch.id === batchId);

    if (index === -1) {
      return;
    }

    this.data.splice(index, 1);
  }

  /**
   * Evento realizado quando a quantidade em sacas é alterada.
   *
   * @param evento
   */
  sacksChanged(evento) {

    // quando é apagado as sacas na digitação, para recuperar precisa ser
    // pelo evento
    let sacks = evento.currentTarget.value;
    this.setSacksAndQuantity(sacks);
  }


  /**
   * Evento realizado quando a quantidade em quilos é alterada.
   *
   * @param evento
   */
  quantityChanged(evento) {

    // quando é apagado as sacas na digitação, para recuperar precisa ser
    // pelo evento
    let kg = evento.currentTarget.value;
    this.setQuantityAndSacks(kg);
  }
}
