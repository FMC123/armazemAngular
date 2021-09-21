import {Component, OnDestroy, OnInit} from "@angular/core";
import {Notification} from "../../../shared/notification";
import {WarehouseStakeholderAutocomplete} from "../../../warehouse-stakeholder/warehouse-stakeholder-autocomplete";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Masks} from "../../../shared/forms/masks/masks";
import {Warehouse} from "../../../warehouse/warehouse";
import {Batch} from "../../../batch/batch";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {WarehouseService} from "../../../warehouse/warehouse.service";
import {WarehouseStakeholderService} from "../../../warehouse-stakeholder/warehouse-stakeholder.service";
import {BatchService} from "../../../batch/batch.service";
import {BatchOperationService} from "../../batch-operation.service";
import {AuthService} from "../../../auth/auth.service";
import {KilosSacksConverterService} from "../../../shared/kilos-sacks-converter/kilos-sacks-converter.service";
import {ErrorHandler} from "../../../shared/errors/error-handler";
import {BatchFilterAutocomplete} from "../../../batch/batch-filter-autocomplete";
import {CustomValidators} from "../../../shared/forms/validators/custom-validators";
import {StorageUnitService} from "../../../storage-unit/storage-unit.service";
import {StorageUnit} from "../../../storage-unit/storage-unit";
import {ModalManager} from "../../../shared/modals/modal-manager";
import {NumberHelper} from "../../../shared/globalization";

@Component({
  selector: 'app-batch-swap',
  templateUrl: 'batch-swap.component.html',
  styleUrls: ['../../../../assets/css/cafe.css']
})

export class BatchSwapComponent implements OnInit, OnDestroy {

  form: FormGroup;
  loading: boolean = false;
  integerMask = Masks.integerMask;
  decimalMask = Masks.decimalMask;

  warehouses: Array<Warehouse> = [];
  batches: Array<Batch> = [];

  originalBatch: Batch;
  originalBatchStorageUnits: Array<StorageUnit> = [];

  ownerAutocomplete: WarehouseStakeholderAutocomplete;
  ownerSubscription: Subscription;
  recipientAutocomplete: WarehouseStakeholderAutocomplete;
  recipientSubscription: Subscription;
  originalBatchAutocomplete: BatchFilterAutocomplete;
  destinyBatchAutocomplete: BatchFilterAutocomplete;
  originalBatchSubscription: Subscription;
  destinyBatchSubscription: Subscription;

  transferConfirm: ModalManager = new ModalManager();
  body: any = {};

  confirmationMessage: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private warehouseService: WarehouseService,
    private warehouseStakeholderService: WarehouseStakeholderService,
    private batchService: BatchService,
    private batchServiceRecipient: BatchService,
    private batchOperationService: BatchOperationService,
    private auth: AuthService,
    private kilosSacksConverterService: KilosSacksConverterService,
    private errorHandler: ErrorHandler,
    private storageUnitService: StorageUnitService
  ) {

  }

  ngOnInit(): void {
    Notification.clearErrors();

    this.warehouseService.list().then(warehouses => {
      warehouses.sort(function (w1, w2) {
        return parseFloat(w1.code) - parseFloat(w2.code);
      });
      this.warehouses = warehouses;
    }).catch(error => this.handleError(error));

    this.ownerAutocomplete = new WarehouseStakeholderAutocomplete(
      this.warehouseStakeholderService,
      this.errorHandler
    );

    this.recipientAutocomplete = new WarehouseStakeholderAutocomplete(
      this.warehouseStakeholderService,
      this.errorHandler
    );

    this.originalBatchAutocomplete = new BatchFilterAutocomplete(
      this.batchService, this.errorHandler
    );

    this.destinyBatchAutocomplete = new BatchFilterAutocomplete(
      this.batchServiceRecipient, this.errorHandler
    );

    this.buildForm();
  }

  ngOnDestroy(): void {

  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'warehouse': [{value: this.auth.accessToken.warehouse.id, disabled: true}, Validators.required],
      'ownerStakeholder': ['', Validators.required],
      'recipientStakeholder': ['', Validators.required],
      'originalBatch': [{value: '', disabled: true}, Validators.required],
      'destinyBatch': [{value: '', disabled: true}, Validators.required],
      'motive': ['', Validators.required],
    });

    this.ownerAutocomplete.value = null;
    this.recipientAutocomplete.value = null;

    this.ownerSubscription = this.ownerAutocomplete.valueChange.subscribe((value) => {
      const ownerStakeholder = value ? value : null;
      this.originalBatchAutocomplete.ownerId = ownerStakeholder ? ownerStakeholder.id : '';
      this.form.get('ownerStakeholder').setValue(ownerStakeholder);
      if (value) {
        this.form.get('originalBatch').enable();
      } else {
        this.form.get('originalBatch').disable();
        this.form.get('originalBatch').setValue('');
        this.originalBatchAutocomplete.value = ''
      }
    });

    this.recipientSubscription = this.recipientAutocomplete.valueChange.subscribe((value) => {
      const recipientStakeholder = value ? value : null;
      this.destinyBatchAutocomplete.ownerId = recipientStakeholder ? recipientStakeholder.id : '';
      this.form.get('recipientStakeholder').setValue(recipientStakeholder);

      if (value) {
        this.form.get('destinyBatch').enable();
      } else {
        this.form.get('destinyBatch').disable();
        this.form.get('destinyBatch').setValue('');
        this.destinyBatchAutocomplete.value = ''
      }
    });

    this.originalBatchSubscription = this.originalBatchAutocomplete.valueChange.subscribe((value) => {
      const originalBatch = value ? value : null;
      if (value) {
        this.form.get('destinyBatch').setValidators([
          Validators.required,
          CustomValidators.differentBatchesValidator(originalBatch.id)
        ]);
        this.originalBatch = Batch.fromData(originalBatch);
        this.storageUnitService.listByBatch(originalBatch.id).then(su => {
          this.originalBatchStorageUnits = su;
          this.originalBatchStorageUnits.map(su => su.batch = this.originalBatch)
        })
      } else {
        this.form.get('destinyBatch').setValidators([
          Validators.required,
        ]);
        this.originalBatchStorageUnits = [];
      }
      this.form.get('originalBatch').setValue(originalBatch);
    });

    this.destinyBatchSubscription = this.destinyBatchAutocomplete.valueChange.subscribe((value) => {
      const destinyBatch = value ? value : null;
      this.form.get('destinyBatch').setValue(destinyBatch);
      destinyBatch ? this.form.get('destinyBatch').markAsDirty() : this.form.get('destinyBatch').markAsPristine();
      this.form.get('destinyBatch').updateValueAndValidity();
    });
  }

  warehouseChange() {
    this.batchService.warehouseId = this.form.value.warehouse || '';
  }

  get allStorageUnitsSelected() {
    return this.originalBatchStorageUnits.every(su => {
      return su.selected === true;
    });
  }

  toggleAllStorageUnits() {
    if (this.allStorageUnitsSelected) {
      this.originalBatchStorageUnits.forEach(su => {
        su.selected = false;
      });
    } else {
      this.originalBatchStorageUnits.forEach(su => {
        su.selected = true;
      });
    }
  }

  get totalCalcString() {
    let selectedSUs = this.originalBatchStorageUnits.filter(su => su.selected === true);
    let totalQuantityByBatch = selectedSUs.map(su => su.quantityByBatch).reduce((a, b) => a + b, 0);
    let totalQuantityByBatchSacks = selectedSUs
      .reduce((sacks, su) => sacks + this.kilosSacksConverterService.kilosToSacks(su.quantityByBatch, su.batch), 0);
    let totalQuantity = this.originalBatchStorageUnits.map(su => su.quantity).reduce((a, b) => a + b, 0);
    let totalQuantitySacks = this.originalBatchStorageUnits
      .reduce((sacks, su) => sacks + this.kilosSacksConverterService.kilosToSacks(su.quantity, su.batch), 0);

    return `KG ${NumberHelper.toPTBR(totalQuantityByBatch)} (${totalQuantityByBatchSacks} SC) /
    KG ${NumberHelper.toPTBR(totalQuantity)} (${totalQuantitySacks} SC)`;
  }

  verifyTransfer() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.body.originBatch = this.form.value.originalBatch;
    this.body.destinationBatch = this.form.value.destinyBatch;
    this.body.description = this.form.value.motive;
    this.body.batches = this.originalBatchStorageUnits.filter(su => {
      return su.selected === true;
    });
    this.confirmationMessage = 'Tem certeza que deseja realizar a transferência do lote ' +
      this.body.originBatch.batchCode +
      ' para o lote ' + this.body.destinationBatch.batchCode + '?';

    if (!this.body.batches.length) {
      Notification.error('Selecione ao menos uma embalagem');
      return;
    }

    this.transferConfirm.open(null);
  }

  save() {
    this.batchOperationService.swapBatches(this.body).then(() => {
      Notification.success('Lote transferido com sucesso!');
      return this.router.navigate(['/batch-operation']);
    }).catch((err) => {
      this.loading = false;
      return this.errorHandler.fromServer(err);
    });
  }
}
