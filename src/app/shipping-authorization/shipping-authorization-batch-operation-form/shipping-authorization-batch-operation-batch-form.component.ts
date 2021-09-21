import {MarkupGroupStorageUnit} from '../../markup-group/storage-unit/markup-group-storage-unit';
import {ShippingAuthorizationMarkupGroupMerger} from './shipping-authorization-markup-group-merger';
import {ErrorHandler} from '../../shared/errors/error-handler';
import {MarkupGroup} from '../../markup-group/markup-group';
import {MarkupGroupService} from '../../markup-group/markup-group.service';
import {ShippingAuthorization} from '../shipping-authorization';
import {NumberHelper} from '../../shared/globalization';
import {CustomValidators} from '../../shared/forms/validators/custom-validators';
import {MarkupGroupBatch} from '../../markup-group/batch/markup-group-batch';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Rx';

import {Batch} from '../../batch/batch';
import {BatchService} from '../../batch/batch.service';
import {Masks} from '../../shared/forms/masks/masks';
import {WarehouseStakeholder} from '../../warehouse-stakeholder/warehouse-stakeholder';
import {Notification} from './../../shared/notification/notification';
import {KilosSacksConverterService} from 'app/shared/kilos-sacks-converter/kilos-sacks-converter.service';
import {TransportationService} from "../../transportation/transportation.service";
import {Transportation} from "../../transportation/transportation";
import {ParameterService} from "../../parameter/parameter.service";

@Component({
  selector: 'app-shipping-authorization-batch-operation-batch-form',
  templateUrl: './shipping-authorization-batch-operation-batch-form.component.html'
})
export class ShippingAuthorizationBatchOperationBatchFormComponent implements OnInit, OnDestroy {
  @Input() markupGroup: MarkupGroup;
  @Input() transportation: Transportation;
  @Input() shippingAuthorization: ShippingAuthorization;
  @Input() submitted = false;
  @Input() hideMarkupGroupButton = false;
  batches: Array<Batch> = [];
  markupGroups: Array<MarkupGroup> = [];
  markupGroupToMergeId: string = '';
  markupGroupBatchEditing: MarkupGroupBatch;
  transportations: Array<Transportation> = [];
  calculationMode: string;

  decimalMask = Masks.decimalMask;
  form: FormGroup;
  loading: boolean = false;
  batchSubscription: Subscription;
  certificates: string;
  batchSelected: Batch;
  merger: ShippingAuthorizationMarkupGroupMerger;
  mgbNotLimitedParam: boolean = true; // default not limited

  constructor(private batchService: BatchService,
              private formBuilder: FormBuilder,
              private markupGroupService: MarkupGroupService,
              private errorHandler: ErrorHandler,
              private kilosSacksConverterService: KilosSacksConverterService,
              private transportationService: TransportationService,
              private parameterService: ParameterService) {
  }

  ngOnInit() {
    Notification.clearErrors();
    this.loading = true;

    this.parameterService.findByKey('CREATE_SHIPMENTS_LARGER_THAN_AUTHORIZATION').then(parameter => {
      if (parameter)
        this.mgbNotLimitedParam = parameter.value === 'S';

      this.merger = new ShippingAuthorizationMarkupGroupMerger(this.mgbNotLimitedParam);
    }).catch();

    this.parameterService.findByKey('BATCH_OPERATION_QUANTITY_CALCULATION_MODE').then(res => {
      if (res) {
        this.calculationMode = res.value;
      }
    });

    Promise.all([
      this.markupGroupService.listWithBatchesInCommonWithShippingAuthorization(this.shippingAuthorization.id),
      this.batchService.listActiveFromShippingAuthorization(this.shippingAuthorization.id),
      this.transportationService.findByShippingAuthorization(this.shippingAuthorization.id)
    ])
      .then((responses) => {
        this.markupGroups = <any>responses[0];
        this.batches = <any>responses[1];
        this.transportations = <any>responses[2];
        this.adjustMaximumBatchQuantities();
        this.buildForm(new MarkupGroupBatch());
        this.loading = false;
      })
      .catch((error) => this.handleError(error));
  }

  ngOnDestroy() {
    if (this.batchSubscription && !this.batchSubscription.closed) {
      this.batchSubscription.unsubscribe();
    }
  }

  get markupGroupsAvailable() {
    if (!this.markupGroups) {
      return [];
    }

    return this.markupGroups.filter(mg => mg.id !== this.markupGroup.id);
  }

  get markupGroupToMerge() {
    return this.markupGroups.find(mg => mg.id === this.markupGroupToMergeId);
  }

  get data() {
    return this.markupGroup.batches;
  }

  get sackQuantityTotal() {
    if (this.mgbNotLimitedParam) {
      return 0;
    }
    else {
      return this.markupGroup.batches.reduce((sct, mgb) => sct + mgb.sackQuantity, 0)
    }
  }

  get sackQuantityTotalForValidation() {
    return this.markupGroup.batches.reduce((sct, mgb) => sct + mgb.sackQuantity, 0)
  }

  get quantityTotal() {
    if (this.mgbNotLimitedParam) {
      return 0;
    }
    else {
      return this.markupGroup.batches.reduce((sct, mgb) => sct + mgb.quantity, 0)
    }
  }

  buildForm(markupGroupBatch: MarkupGroupBatch) {
    this.form = this.formBuilder.group({
      'batchId': [markupGroupBatch.batch ? markupGroupBatch.batch.id || '' : '', Validators.required],
      'quantityString': [markupGroupBatch.quantityString || '', [Validators.required, CustomValidators.minValidator(1)]],
      'sacksQuantityString': [markupGroupBatch.sackQuantity || '', [Validators.required]],
      'markupGroupBatchOrigin': [markupGroupBatch],
      'calcManual': [markupGroupBatch && markupGroupBatch.calcManual ? markupGroupBatch.calcManual : false],
    }, {
      validator: this.maxQuantityValidator(),

    });

    if (this.batchSubscription && !this.batchSubscription.closed) {
      this.batchSubscription.unsubscribe();
    }

    this.batchSubscription = this.form.get('batchId').valueChanges.subscribe((value) => {
      this.batchSelected = this.batches.find(b => b.id === value);

      if (this.batchSelected) {
        this.form.get('quantityString').setValue(NumberHelper.toPTBR(this.batchSelected.availableWeight));
        this.form.get('quantityString').markAsDirty();
        this.certificates = this.batchSelected.batchOperation.certificateNames;
      } else {
        this.form.get('quantityString').setValue(null);
        this.form.get('quantityString').markAsDirty();
        this.certificates = '';
      }

      let quantity = 0;
      let sacks = 0;
      // set quantity and sacks from markup group
      if (this.markupGroupsAvailable && this.markupGroupsAvailable.length && this.batchSelected) {
        for (let i of this.markupGroupsAvailable) {
          for (let b of i.batches) {
            if (b.batch.batchCode === this.batchSelected.batchCode) {
              quantity = b.leftQuantity;
              sacks = b.weightSack;
            }
          }
        }
        if (quantity)
          this.form.get('quantityString').setValue(NumberHelper.toPTBR(quantity));
        if (sacks)
          this.form.get('sacksQuantityString').setValue(sacks);
      }
      if (!quantity && !sacks) {
        // this.setQuantityAndSacks((this.batchSelected) ? this.batchSelected.availableWeight : 0);
        this.setQuantityAndSacks((this.batchSelected) ? this.getShippingAuthorizationBatchLeftQuantity(this.batchSelected) : 0);
      }
    });
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

    this.form.get('quantityString').setValue(NumberHelper.toPTBR(availableWeight));
    this.form.get('sacksQuantityString').setValue(sacks);
  }

  getShippingAuthorizationBatchLeftQuantity(batch: Batch): number {
    let mgb: MarkupGroupBatch = this.shippingAuthorization.batches.find(b => b.batch.id === batch.id)
    let mgBatchTotalLeftQuantity: number = 0;

    //Busca as quantidades já selecionadas em cada transportation
    for (var indexTransp in this.transportations) {
      let transportation: Transportation = this.transportations[indexTransp];
      if (this.transportation.id != transportation.id) {
        let batchesOpOut: Array<MarkupGroupBatch> = transportation.batchOperationOut.markupGroup.batches;
        for (var indexMarkBatch in batchesOpOut) {
          let markupGroupBatch: MarkupGroupBatch = batchesOpOut[indexMarkBatch];
          if (markupGroupBatch.batch.id == batch.id) {
            mgBatchTotalLeftQuantity += markupGroupBatch.leftQuantity;
          }
        }
      }
    }

    if (this.mgbNotLimitedParam)
      return mgb.leftQuantity;
    else
      return mgb.leftQuantity - mgBatchTotalLeftQuantity;
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
    this.form.get('quantityString').setValue(NumberHelper.toPTBR(+availableWeight));
    this.form.get('sacksQuantityString').setValue(sacks);
  }

  maxQuantityValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const batch = this.batches.find(b => b.id === control.value.batchId);

      if (!batch) {
        return null;
      }

      const value = control.value.quantityString;
      const valueSack = control.value.sacksQuantityString;

      if (!value && value !== '0' && value !== 0) {
        return null;
      }

      let leftQuantity: number = this.getShippingAuthorizationBatchLeftQuantity(batch);
      if (NumberHelper.fromPTBR(value) > leftQuantity) {
        let requiredValue = leftQuantity % 1 !== 0 ? NumberHelper.toPTBR(leftQuantity) : leftQuantity;
        return {'max': {'requiredValue': requiredValue, 'actualValue': value}};
      }

      if (this.calculationMode !== 'NF') {
        let maxWeight: number = this.transportation.maxWeight;
        let subQuantity = this.markupGroupBatchEditing ? this.markupGroupBatchEditing.quantity : 0;
        if (maxWeight && (NumberHelper.fromPTBR(value) + this.quantityTotal - subQuantity) > maxWeight) {
          let requiredValue = maxWeight % 1 !== 0 ? NumberHelper.toPTBR(maxWeight) : maxWeight;
          return {'max': {'requiredValue': requiredValue, 'actualValue': value}};
        }
      } else {
        let maxWeight: number = this.transportation.maxWeight;
        let sacksTotal: number = this.sackQuantityTotal - (this.markupGroupBatchEditing ? this.markupGroupBatchEditing.sackQuantity : 0);
        if (maxWeight  && (NumberHelper.fromPTBR(valueSack) + (sacksTotal) ) > (maxWeight/ 60)) {
          let requiredValue = maxWeight % 1 !== 0 ? NumberHelper.toPTBR(maxWeight / 60) : maxWeight/60;
          return {'maxSacks': {'requiredValue': requiredValue, 'actualValue': sacksTotal}};
        }

      }

      return null;
    };
  }

  get filteredData() {
    return this.data;
  }

  get availableBatches() {
    const notInList = (u) => {
      if (this.markupGroupBatchEditing && this.markupGroupBatchEditing.batch.id === u.id) {
        return true;
      }

      let alreadyInList = this.data.some((au) => au.batch.id === u.id);
      return !alreadyInList;
    };

    return this.batches
      .filter(notInList);
  }

  get noFunds() {
    return (!this.filteredData || !this.filteredData.length) && (!this.availableBatches || !this.availableBatches.length);
  }

  mergeMarkupGroup() {
    if (!this.markupGroup) {
      return;
    }
    this.merger.merge(this.markupGroupToMerge, this.markupGroup, this.batches, this.shippingAuthorization, this.transportation, this.transportations);

    if (this.parameterService.specificParamsServiceInstructionWahehouseGeneral()) {
      this.batches.forEach(b => {
        let actualQuantity = this.getShippingAuthorizationBatchLeftQuantity(b);
        this.markupGroup.batches.forEach(mgb => {
          if (mgb.batch.id === b.id) {
            mgb.quantity = actualQuantity;
          }
        })
      });
    }

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
    let markupGroupBatchOrigin = this.form.value.markupGroupBatchOrigin;

    let markupGroupBatch = this.data.find(mgb => mgb.batch.id === batchId);

    let toInclude = false;
    if (!markupGroupBatch) {
      markupGroupBatch = new MarkupGroupBatch();
      toInclude = true;
    }
    markupGroupBatch.batch = this.batches.filter((u) => u.id === batchId)[0];
    markupGroupBatch.markupGroupBatchParent = markupGroupBatchOrigin;
    markupGroupBatch.quantityString = quantityString;
    markupGroupBatch.calcManual = this.isCalcManual();
    markupGroupBatch.updateWeightSack = NumberHelper.fromPTBR(this.form.value.sacksQuantityString);
    markupGroupBatch.sackQuantity = markupGroupBatch.weightSack;

    if (toInclude) {
      this.data.push(markupGroupBatch);
    }

    this.markupGroupBatchEditing = null;
    this.buildForm(new MarkupGroupBatch());
  }

  edit(markupGroupBatch: MarkupGroupBatch) {
    this.markupGroupBatchEditing = markupGroupBatch;
    this.batchSelected = this.markupGroupBatchEditing.batch;
    this.buildForm(this.markupGroupBatchEditing);

    let actualQuantity = this.getShippingAuthorizationBatchLeftQuantity(this.batchSelected);
    this.setQuantityAndSacks(actualQuantity);

  }

  remove(batchId: string) {
    let index = this.data.findIndex((wu) => wu.batch.id === batchId);

    if (index === -1) {
      return;
    }

    this.data.splice(index, 1);

    this.markupGroup.storageUnits = this.markupGroup.storageUnits.filter(su => {
      return !su.storageUnitBatch.batch || su.storageUnitBatch.batch.id !== batchId;
    });
  }

  removeMarkupGroupStorageUnit(markupGroupStorageUnitId: string) {
    let index = this.markupGroup.storageUnits.findIndex((wu) => wu.id === markupGroupStorageUnitId);

    if (index === -1) {
      return;
    }

    this.markupGroup.storageUnits.splice(index, 1);
  }

  markupGroupStorageUnitsOfBatch(batchId: string) {
    return this
      .markupGroup
      .storageUnits
      .filter(su => {
        return su.storageUnitBatch.batch && su.storageUnitBatch.batch.id === batchId;
      });
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  /**
   * Evento realizado quando a quantidade em sacas é alterada.
   *
   * @param evento
   */
  sacksChanged(evento) {
    if (this.isCalcManual() == false) {
      // quando é apagado as sacas na digitação, para recuperar precisa ser
      // pelo evento
      let sacks = NumberHelper.fromPTBR(evento.currentTarget.value);
      this.setSacksAndQuantity(sacks);
    }
  }


  /**
   * Evento realizado quando a quantidade em quilos é alterada.
   *
   * @param evento
   */
  quantityChanged(evento) {
    if (this.isCalcManual() == false) {
      // quando é apagado as sacas na digitação, para recuperar precisa ser
      // pelo evento
      let kg = NumberHelper.fromPTBR(evento.currentTarget.value);
      this.setQuantityAndSacks(kg);
    }
  }

  /**
   * Ajustar as quantidades máximas permitidas para os batches, pois podem ter sido usadas em outros embarques
   */
  adjustMaximumBatchQuantities() {

    if (this.markupGroups == null || this.markupGroups.length == 0
      || this.batches == null || this.batches.length == 0) {
      return;
    }

    // percorre os bacthes disponíveis
    this.batches.forEach(batch => {

      let totalUsadoBatch = 0;

      // embarques que não sejam a autorização em si (somente operações)
      this.markupGroupsAvailable.forEach(mg => {
        if (mg.type === 'BATCH_OPERATION') {

          // percorre lotes já vinculados
          if (mg.batches != null && mg.batches.length > 0) {
            mg.batches.forEach(mgb => {

              // mesmo batch (não pode ser fechado)
              if (mgb.batch.id == batch.id && mgb.status != 'CLOSE') {
                totalUsadoBatch += mgb.quantity;
              }
            });
          }
        }
      });

      // subtrai quantidade usada no valor disponível
      batch.availableWeight = batch.netWeight - totalUsadoBatch;
    });
  }

  isCalcManual(): boolean {
    return (this.form.get('calcManual').value) ? true : false;
  }
}
