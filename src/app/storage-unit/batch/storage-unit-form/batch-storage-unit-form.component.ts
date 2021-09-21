import { Tag } from '../../../tag/tag';
import { CustomValidators } from '../../../shared/forms/validators/custom-validators';
import { PackStockService } from '../../../pack-stock/pack-stock.service';
import { PackStockOwner } from '../../../pack-stock/pack-stock-owner';
import { Subscription } from 'rxjs/Rx';
import { AuthService } from '../../../auth/auth.service';
import { PackTypeService } from '../../../pack-type/pack-type.service';
import { StackService } from '../../../stack/stack.service';
import { PositionService } from '../../../position/position.service';
import { Masks } from '../../../shared/forms/masks/masks';
import { Position } from '../../../position/position';
import { PackType } from '../../../pack-type/pack-type';
import { Stack } from '../../../stack/stack';
import { Notification } from '../../../shared/notification';
import { ErrorHandler } from '../../../shared/errors/error-handler';
import { StorageUnitBatch } from '../../storage-unit-batch';
import { StorageUnit } from '../../storage-unit';
import { BatchStorageUnitService } from '../batch-storage-unit.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PositionAutocomplete } from 'app/position/position-autocomplete';
import { StorageUnitService } from 'app/storage-unit/storage-unit.service';
import { ModalManager } from 'app/shared/shared.module';

@Component({
  selector: 'app-batch-storage-unit-form',
  templateUrl: 'batch-storage-unit-form.component.html',
  styleUrls: ['batch-storage-unit-form.component.less']
})

export class BatchStorageUnitFormComponent implements OnInit, OnDestroy {

  form: FormGroup;
  storageUnit: StorageUnit;
  storageUnitBatch: StorageUnitBatch;
  loading = false;
  positions: Array<Position>;
  stacks: Array<Stack>;
  selectedPosition: Position;
  packTypes: Array<PackType>;
  packStockOwners: Array<PackStockOwner>;
  heightOfStack: Number = 0;
  integerMask = Masks.integerMask;
  decimalMask = Masks.decimalMask;

  stackSubscription: Subscription;
  packTypeSubscription: Subscription;
  savedSubscription: Subscription;
  editedSubscription: Subscription;
  deletedSubscription: Subscription;

  positionAutocomplete: PositionAutocomplete;
  positionSubscription: Subscription;
  storageUnits: Array<StorageUnit> = [];
  confirmDialog: ModalManager = new ModalManager();

  constructor(
    private auth: AuthService,
    private batchStorageUnitService: BatchStorageUnitService,
    private positionService: PositionService,
    private stackService: StackService,
    private packTypeService: PackTypeService,
    private packStockService: PackStockService,
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandler,
    private serverService: StorageUnitService,
  ) { }

  ngOnInit() {

    this.positionAutocomplete = new PositionAutocomplete();
    this.loadList();
    this.positionService.listByWarehouseAndType(this.auth.accessToken.warehouse.id).then(positions => {
      this.positions = positions;
      this.positionAutocomplete.setPositions(positions);
    });

    this.packTypeService.list().then(packTypes => {
      this.packTypes = packTypes;
    });

    this.savedSubscription = this.batchStorageUnitService.saved.subscribe((storageUnit: StorageUnit) => {
      this.storageUnit = storageUnit;
      this.heightOfStack = this.storageUnit.stack.stackHeight;
      if(storageUnit.batches)
      {
        this.storageUnitBatch = storageUnit.batches.find(sub => sub.batch.id === this.batch.id);
      }
      this.selectedPosition = storageUnit.position;
      this.buildForm();
      this.loadList();
    });

    this.editedSubscription = this.batchStorageUnitService.edited.subscribe((storageUnit: StorageUnit) => {
      this.storageUnit = storageUnit;
      this.heightOfStack = this.storageUnit.stack.stackHeight;
      if(storageUnit.batches) {
        this.storageUnitBatch = storageUnit.batches.find(sub => sub.batch.id === this.batch.id);
      }
      this.selectedPosition = storageUnit.position;
      this.buildForm();
      this.loadList();
    });

    this.deletedSubscription = this.batchStorageUnitService.deleted.subscribe((storageUnit: StorageUnit) => {
      if (this.storageUnit && this.storageUnit.id === storageUnit.id) {
        this.reset();
      }

      this.refreshPackStockOwners(this.form.get('packTypeId').value);
      this.loadList();
    });

    this.reset();
  }

  loadList() {
    let batchId = this.batch.id;
    this.serverService.listByBatch(batchId).then((storageUnits) => {
      this.storageUnits = storageUnits;
      this.storageUnits.map(su => su.batch = this.batch)
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  ngOnDestroy() {

    let subscriptions = [
      this.stackSubscription,
      this.packTypeSubscription,
      this.savedSubscription,
      this.editedSubscription,
      this.deletedSubscription,
      this.positionSubscription
    ];

    subscriptions.forEach((subscription: Subscription) => {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }

  get batch() {
    return this.batchStorageUnitService.batch;
  }

  get batchOperation() {
    return this.batchStorageUnitService.batchOperation;
  }

  resetPreservingCommonData() {
    this.storageUnit = new StorageUnit();
    if(this.positions)
    {
      this.storageUnit.position = this.positions.find(p => p.id === this.form.value.positionId);
    }
    if(this.stacks)
    {
      this.storageUnit.stack = this.stacks.find(s => s.id === this.form.value.stackId);
    }
    this.storageUnit.stackHeight = Number(this.form.value.stackHeight) >= this.heightOfStack ? Number(this.form.value.stackHeight) : Number(this.form.value.stackHeight) + 1;

    this.storageUnit.indRepackage = this.form.value.indRepackage || false;
    if(this.packTypes)
    {
      this.storageUnit.packType = this.packTypes.find(pt => pt.id === this.form.value.packTypeId);
    }
    if (this.trackStock) {
      if (!this.storageUnit.indRepackage) {
        if(this.packStockOwners)
        {
          this.storageUnit.packTypeOwner = this.packStockOwners.find(pto => pto.owner.id === this.form.value.packTypeOwnerId).owner;
        }
      }
    } else {
      this.storageUnit.packTypeQuantity = 0;
      this.storageUnit.packTypeQuantityComplement = 0;
      this.storageUnit.packTypeOwner = null;
    }

    this.storageUnitBatch = new StorageUnitBatch(
      null,
      null,
      this.batch
    );

    this.buildForm();
  }

  reset() {
    this.storageUnit = new StorageUnit();
    this.selectedPosition = new Position();
    this.storageUnitBatch = new StorageUnitBatch(
      null,
      null,
      this.batch
    );
    this.buildForm();
  }

  buildForm() {
    this.loading = true;

    this.form = this.formBuilder.group({
      'positionId': [this.storageUnit.position ? this.storageUnit.position.id || '' : '', [Validators.required]],
      'stackId': [this.storageUnit.stack ? this.storageUnit.stack.id || '' : '', [Validators.required]],
      'stackHeight': [this.storageUnit.stackHeight || '1', [Validators.required, CustomValidators.minValidator(1)]],
      'tagCode': [this.storageUnit.tag ? this.storageUnit.tag.tagCode || '' : ''],
      'quantity': [this.storageUnitBatch.quantityString || 0, [Validators.required, CustomValidators.minValidator(1)]],
      'unitType': [this.storageUnitBatch.unitType || 'KG', [Validators.required]],
      'indRepackage': [this.storageUnit.indRepackage || false],
      'packTypeId': [this.storageUnit.packType ? this.storageUnit.packType.id || '' : '', [Validators.required]],
      'packTypeQuantity': [this.storageUnit.packTypeQuantity || 1, [Validators.required, CustomValidators.minValidator(1)]],
      'packTypeQuantityComplement': [this.storageUnit.packTypeQuantityComplement || 0, [CustomValidators.minValidator(0)]],
      'packTypeOwnerId': [this.storageUnit.packTypeOwner ? this.storageUnit.packTypeOwner.id || '' : '', [Validators.required]],
    });

    this.stackSubscription = this.form.get('positionId').valueChanges.subscribe((positionId) => {
      this.refreshStacks(positionId);
      if(this.positions)
      {
        this.selectedPosition = this.positions.find(pos => pos.id === positionId);
      }

      if (this.selectedPosition == null || this.selectedPosition == undefined) {
        this.selectedPosition = new Position();
      }

      if (this.selectedPosition.isSilo) {
        this.form.controls["packTypeId"].setValidators(null);
        this.form.controls["packTypeId"].updateValueAndValidity();
      } else {
        this.form.controls["packTypeId"].setValidators(Validators.required);
        this.form.controls["packTypeId"].updateValueAndValidity();
      }
    });

    if (this.selectedPosition.isSilo) {
      this.form.controls["packTypeId"].setValidators(null);
      this.form.controls["packTypeId"].updateValueAndValidity();
    } else {
      this.form.controls["packTypeId"].setValidators(Validators.required);
      this.form.controls["packTypeId"].updateValueAndValidity();
    }

    this.packTypeSubscription = this.form.get('packTypeId').valueChanges.subscribe((packTypeId) => {
      this.verifyAndShowNotification(packTypeId)
      this.refreshPackStockOwners(packTypeId);
    });

    this.positionAutocomplete.value = this.storageUnit.position;
    this.positionSubscription = this.positionAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('positionId').setValue(id);
    });

    let promises = [];
    if (this.storageUnit.position && this.storageUnit.position.id) {
      promises.push(this.refreshStacks(this.storageUnit.position.id));
    }

    if (this.storageUnit.packType && this.storageUnit.packType.id) {
      promises.push(this.refreshPackStockOwners(this.storageUnit.packType.id));
    }

    return Promise.all(promises).then(() => {
      this.loading = false;
    }).catch((error) => this.handleError(error));
  }


  beforeSave() {
    let totalWeight = this.batch.netWeight;
    let totalWeightForStorageUnits = 0;
    this.storageUnits.forEach(storage => {
      totalWeightForStorageUnits = totalWeightForStorageUnits + storage.quantity;
    })
    let newWeightAdd = +this.form.get('quantity').value;
    if (totalWeight < (totalWeightForStorageUnits + newWeightAdd)) {
      this.confirmDialog.open(null);
    }
    else {
      this.save()
    }
  }

  save() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if(this.positions)
    {
      this.storageUnit.position = this.positions.find(p => p.id === this.form.value.positionId);
    }

    if (this.trackStock && this.storageUnit.position != null && !this.storageUnit.position.isSilo) {
      this.form.get('packTypeQuantity').enable();
      this.form.get('packTypeQuantityComplement').enable();
      if (!this.indRepackage) {
        this.form.get('packTypeOwnerId').enable();
      } else {
        this.form.get('packTypeOwnerId').disable();
      }
    } else {
      this.form.get('packTypeQuantity').disable();
      this.form.get('packTypeQuantityComplement').disable();
      this.form.get('packTypeOwnerId').disable();
    }

    if (!this.form.valid) {
      return;
    }

    this.loading = true;
    this.storageUnit.batch = this.batch;
    if (!this.selectedPosition.isSilo) {
      if(this.stacks)
      {
        this.storageUnit.stack = this.stacks.find(s => s.id === this.form.value.stackId);
      }
      this.storageUnit.stackHeight = this.form.value.stackHeight;
      this.storageUnit.indRepackage = this.form.value.indRepackage || false;
      if(this.packTypes)
      {
        this.storageUnit.packType = this.packTypes.find(pt => pt.id === this.form.value.packTypeId);
      }
      this.storageUnit.tag = new Tag();
      this.storageUnit.tag.tagCode = this.form.value.tagCode;
    } else {
      this.storageUnit.indRepackage = true;
    }

    this.storageUnitBatch.quantityString = this.form.value.quantity;
    this.storageUnitBatch.quantityRefString = this.form.value.quantity;
    this.storageUnitBatch.unitType = this.form.value.unitType;

    this.storageUnit.batches = [
      this.storageUnitBatch
    ];

    if (this.trackStock) {
      this.storageUnit.packTypeQuantity = this.form.value.packTypeQuantity || 0;
      this.storageUnit.packTypeQuantityComplement = this.form.value.packTypeQuantityComplement || 0;

      if (!this.storageUnit.indRepackage) {
        if(this.packStockOwners)
        {
          this.storageUnit.packTypeOwner = this.packStockOwners.find(pto => pto.owner.id === this.form.value.packTypeOwnerId).owner;
        }
      } else {
        this.storageUnit.packTypeOwner = this.batchOperation.owner;
      }
    } else {
      this.storageUnit.packTypeQuantity = 0;
      this.storageUnit.packTypeQuantityComplement = 0;
      this.storageUnit.packTypeOwner = null;
    }

    return this.batchStorageUnitService.save(this.storageUnit).then(() => {
      Notification.clearErrors();
      Notification.success('Unidade de armazenamento salva com sucesso!');
      this.resetPreservingCommonData();
      this.loading = false;
    }).catch((error) => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  get trackStock() {
    let packTypeId = this.form.value.packTypeId;

    if (!packTypeId) {
      return false;
    }

    let packType = null;
    if(this.packTypes)
    {
      packType = this.packTypes.find(pt => pt.id === packTypeId);
    }

    if (!packType) {
      return false;
    }

    return !!packType.trackStock;
  }

  get weightInSacks(): Number {
    if (this.batch.averageWeightBagsObject) {
      return Math.round(+this.form.get('quantity').value / this.batch.averageWeightBagsObject);
    }
    return 0;
  }

  verifyAndShowNotification(packTypeId) {
    let sacs = +this.form.get('quantity').value;
    if (sacs > 0 && packTypeId !== "") {
      if(this.packTypes)
      {
        let packType = null;
        if(this.packTypes)
        {
          packType = this.packTypes.find(pack => pack.id === packTypeId);
        }
        if (sacs > packType.capacity && packType.capacity > 0) {
          Notification.notification(`O peso informado excede a capacidade de peso da embalagem selecionada (${packType.capacity})`)
        }
      }
    }
  }

  changeWeight() {
    let packTypeId = this.form.get('packTypeId').value;
    this.verifyAndShowNotification(packTypeId)
  }

  get indRepackage() {
    return !!this.form.value.indRepackage;
  }

  private refreshStacks(positionId) {
    if (!positionId) {
      this.stacks = [];
      this.form.get('stackId').setValue('');
      return Promise.resolve();
    }

    return this.stackService.list(positionId).then(stacks => {
      this.stacks = stacks;
      const currentStackId = this.form.get('stackId').value;
      if (!currentStackId || !this.stacks.some(s => s.id === currentStackId)) {
        this.heightOfStack = this.stacks[0].stackHeight;
        this.form.get('stackId').setValue(this.stacks[0].id);
      }
    });
  }

  changeStack() {
    const currentStackId = this.form.get('stackId').value;
    if(this.stacks)
    {
      let stack = this.stacks.find(stack => stack.id === currentStackId);
      if (stack !== null && stack.id !== undefined) {
        this.heightOfStack = stack.stackHeight;
        const currentStackHeight = +this.form.get('stackHeight').value;
        if (currentStackHeight > stack.stackHeight) {
          this.form.get('stackHeight').setValue(stack.stackHeight)
        }
      }
    }
  }

  stackHeightList(heightOfStack) {
    let stackHeightArray = [];
    for (let i = 1; i <= heightOfStack; i++) {
      stackHeightArray.push(i);
    }
    return stackHeightArray;
  }

  changeStackHeight = (e) => {
    let previousNumber = this.form.get('stackHeight').value;
    if (isNaN(e.key)) {
      return false;
    }
    previousNumber = previousNumber + e.key;
    return +previousNumber <= this.heightOfStack;
  }

  private refreshPackStockOwners(packTypeId) {
    if(this.packTypes)
    {
      let packType = this.packTypes.find(pt => pt.id === packTypeId);

      if (!packType || !packType.trackStock || this.form.value.indRepackage) {
        this.packStockOwners = [];
        this.form.get('packTypeOwnerId').setValue('');
        return Promise.resolve();
      }
    }

    return this.packStockService.listOwnersAvailableForPackType(packTypeId, this.storageUnit.id).then((packStockOwners) => {
      this.packStockOwners = packStockOwners;

      let current = this.form.get('packTypeOwnerId').value || this.batchOperation.owner.id;

      let exists = this.packStockOwners
        && this.packStockOwners.length
        && this.packStockOwners.findIndex(pso => pso.owner.id === current) > -1;

      if (exists) {
        this.form.get('packTypeOwnerId').setValue(current);
      } else {
        this.form.get('packTypeOwnerId').setValue('');
      }
    });
  }

  public closeConfirmDialog() {
    // fecha confirmação
    this.confirmDialog.close();
    // habilita novamente os campos
    this.form.get('packTypeQuantity').enable();
    this.form.get('packTypeQuantityComplement').enable();
    this.form.get('packTypeOwnerId').enable();
  }
}
