import {BatchStatus} from '../../../batch/batch-status';
import {BatchPositionService} from './../../../batch/batch-position/batch-position.service';
import {AutomationTypeModal} from './../../../automation-route/automation-route-modal-type';
import {BatchReceiveType} from '../../../batch/batch-receive-type';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {Subscription} from 'rxjs/Rx';
import {AuthService} from '../../../auth/auth.service';
import {BatchOperation} from '../../../batch-operation/batch-operation';
import {BatchOperationStatus} from '../../../batch-operation/batch-operation-status';
import {Batch} from '../../../batch/batch';
import {BatchWeight} from '../../../batch/batch-weight';
import {BatchService} from '../../../batch/batch.service';
import {Drink} from '../../../drink/drink';
import {DrinkService} from '../../../drink/drink.service';
import {PackType} from '../../../pack-type/pack-type';
import {PackTypeService} from '../../../pack-type/pack-type.service';
import {ErrorHandler} from '../../../shared/errors/error-handler';
import {Masks} from '../../../shared/forms/masks/masks';
import {ModalManager} from '../../../shared/modals/modal-manager';
import {Notification} from '../../../shared/notification';
import {Page} from '../../../shared/page/page';
import {Strainer} from '../../../strainer/strainer';
import {StrainerService} from '../../../strainer/strainer.service';
import {BalanceService} from '../../balance.service';
import {BalanceTransportationInService} from '../balance-transportation-in.service';
import {TypeCoffee} from './../../../pack-type/type-coffee';
import {NumberHelper} from './../../../shared/globalization/number-helper';
import {GenericType} from '../../../pack-type/generic-type';
import {ActivatedRoute} from '../../../../../node_modules/@angular/router';
import {CustomValidators} from '../../../shared/forms/validators/custom-validators';
import {TransportationFiscalNoteService} from 'app/transportation/transportation-fiscal-note/transportation-fiscal-note.service';
import {FiscalNote} from 'app/fiscal-note/fiscal-note';
import {Transportation} from "../../../transportation/transportation";
import {TransportationFiscalNoteCertificateService} from "../../../transportation/transportation-fiscal-note/certificate/transportation-fiscal-note-certificate.service";
import {ContaminantService} from "../../../contaminant/contaminant.service";
import {Contaminant} from "../../../contaminant/contaminant";

@Component({
  selector: 'app-balance-transportation-batch-child-weighing',
  templateUrl: './balance-transportation-batch-child-weighing.component.html'
})
export class BalanceTransportationBatchChildWeighingComponent
  implements OnInit {
  @Input() batchOperation: BatchOperation;
  @Input() transportation: Transportation;
  @Output() refreshBatchOperation = new EventEmitter<void>();

  form: FormGroup;
  strainers: Array<Strainer>;
  drinks: Array<Drink>;
  batch: Batch;
  batches: Array<Batch>;
  newBatch = false;
  loading = false;
  deleteConfirm: ModalManager = new ModalManager();
  decimalMask = Masks.decimalMask;
  integerMask = Masks.integerMask;
  packTypes: Array<PackType>;
  packTypeSubscription: Subscription;
  receiveTypeSubscription: Subscription;
  trackStock: boolean = true;
  page: Page<Batch> = new Page<Batch>();
  typeCoffee: Array<TypeCoffee> = [];
  contaminants: Array<Contaminant> = [];
  receiveTypes = BatchReceiveType.list();
  visible: boolean;
  batchReceivingModalComponent: ModalManager = new ModalManager();
  storageUnitSacariaFormModal = new ModalManager();
  // nota fiscal do batch operation
  fiscalNote: FiscalNote = null;

  private editGross;
  private editTare;
  private editNetQuantityValue;

  isCertificated = true;

  constructor(
    private auth: AuthService,
    private balanceService: BalanceService,
    private balanceTransportationInService: BalanceTransportationInService,
    private strainerService: StrainerService,
    private drinkService: DrinkService,
    private batchService: BatchService,
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandler,
    private packTypeService: PackTypeService,
    private batchPositionService: BatchPositionService,
    private route: ActivatedRoute,
    private fiscalNoteService: TransportationFiscalNoteService,
    private transportationFiscalNoteCertificateService: TransportationFiscalNoteCertificateService,
    private contaminantService: ContaminantService
  ) {
    this.visible = false;
  }

  get readOnly() {
    return (
      this.batchOperation.status &&
      this.batchOperation.status === BatchOperationStatus.CLOSED.code
    );
  }

  ngOnInit() {
    this.balanceService.weighingMode().then(mode => {
      this.balanceTransportationInService.weighingMode = mode;
    });

    this.packTypeService.list().then(packTypes => {
      this.packTypes = packTypes;
    });

    this.strainerService.list().then(strainers => {
      this.strainers = strainers;
    });

    this.drinkService.list().then(drinks => {
      this.drinks = drinks;
    });

    this.contaminantService.list().then(contaminants => {
      this.contaminants = contaminants;
    });

    //this.reset();

    let isRecalculate = this.route.snapshot.queryParams['recalculate'];

    if (isRecalculate) {
      this.loadRecalculateList()
    } else {
      this.loadList();
    }

    this.loadTypeCoffee();
  }

  /**
   * Carrega informações da ordem de compra se houver, para colocar no batch por padrão (na criação)
   */
  loadFiscalNoteFromBatchOperationAndCertificates() {
    if (this.fiscalNote == null) {
      return this.fiscalNoteService.listFiscalNoteByBatchOperation(this.batchOperation.id).then(fiscalNotes => {
        if (fiscalNotes != null && fiscalNotes.length > 0) {
          this.fiscalNote = fiscalNotes[0];
          this.loadFiscalNoteCertificates();
        }
      });
    }
  }

  loadFiscalNoteCertificates() {
    this.transportationFiscalNoteCertificateService.list(this.transportation.id, this.fiscalNote.id).then(certificates => {
      if (certificates.length === 0) {
        this.isCertificated = false;
      }
    });
  }

  ngOnDestroy() {
    this.page.changeQuery.unsubscribe();

    let subscriptions = [
      this.packTypeSubscription,
      this.receiveTypeSubscription
      /*this.editedSubscription,
     this.deletedSubscription,*/
    ];

    subscriptions.forEach((subscription: Subscription) => {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }

  /*reset() {
    this.batch = null;
    //this.trackStock = true;
    //this.batch.batchOperation = this.batchOperation;
    //this.buildForm();
  }*/

  edit(batch: Batch) {
    this.batch = batch;
    this.visible = true;
    this.trackStock = true;
    this.batch.batchOperation = this.batchOperation;
    this.buildForm();
  }

  buildForm() {

    this.form = this.formBuilder.group({
      strainerId: [this.batch.strainer ? this.batch.strainer.id || '' : ''],
      drinkId: [this.batch.drink ? this.batch.drink.id || '' : ''],
      moistureContent: [this.batch.moistureContentString || ''],
      batchCode: {
        value: this.batch.batchCode || '',
        disabled: !!this.batch.batchCode
      },
      refClient: [this.batch.refClient || ''],
      packTypeId: [this.batch.packType ? this.batch.packType.id || '' : '', [Validators.required]],
      storageTypeId: [
        this.batch.storageType ? this.batch.storageType.id || '' : '',
        [
          Validators.required,
          this.storageTypeMatchesWarehouse.bind(this)
        ]
      ],
      //indKeepPack: [this.batch.indKeepPack || false],
      typeCoffeeId: [
        this.batch.typeCoffee ? this.batch.typeCoffee : this.isCertificated ? TypeCoffee.PERSONALIZADO.code : TypeCoffee.NORMAL.code,
        [Validators.required, this.requiredTypeCoffee]
      ],
      contaminant: [this.batch.contaminants && this.batch.contaminants.length &&  this.batch.contaminants.map((c) => {
        return {id: c.id, text: c.name + (c.allergenic ? ' (alerg.)': '')};
      })],
      receiveType: [
        this.batch.receiveType || BatchReceiveType.NORMAL.code,
        [
          Validators.required,
          //this.hasPermissionForBatchCodeChangeValidation.bind(this)
        ]
      ],
      netQuantity:[this.batch.netQuantity || ''],
      observation: [this.batch.observation ? this.batch.observation || '' : ''],
    });

    if (this.batch.packType && this.batch.packType.id) {
      this.trackStock = this.batch.packType.trackStock;
    }

    this.receiveTypeSubscription = this.form
      .get('receiveType')
      .valueChanges.subscribe(value => {
        if (value !== BatchReceiveType.NORMAL.code) {
          this.form.get('batchCode').enable();
        } else {
          this.form.get('batchCode').disable();
        }
      });

    this.packTypeSubscription = this.form
      .get('packTypeId')
      .valueChanges.subscribe(value => {
        let p: PackType = this.packTypes.find(s => s.id === value);
        if (p) {
          this.trackStock = p.trackStock;
        }
      });

    this.loadFiscalNoteFromBatchOperationAndCertificates();
  }

  requiredTypeCoffee(control: AbstractControl) {
    if (control.value === TypeCoffee.NENHUM.code) {
      return {typeCoffeeIsNenhum: true};
    }
    return null;
  }

  storageTypeMatchesWarehouse(control: AbstractControl) {
    if (!control.value) {
      return null;
    }

    const warehouseHasSacaria =
      this.auth.accessToken &&
      this.auth.accessToken.warehouse &&
      this.auth.accessToken.warehouse.storageTypeSacaria;

    if (warehouseHasSacaria) {
      return null;
    }

    if (!this.packTypes) {
      return null;
    }

    const storageType = this.packTypes.find(pt => pt.id === control.value);

    if (storageType.genericType === GenericType.SACAS.code) {
      return {noPermissionForSacaria: true};
    }

    return null;
  }

  /*hasPermissionForBatchCodeChangeValidation(control: AbstractControl) {
    const hasPermission =
      this.auth.accessToken.admin || this.auth.accessToken.leader;
    const value = control.value;

    if (!hasPermission && value !== BatchReceiveType.NORMAL.code) {
      return { noPermissionForBatchCodeChange: true };
    }

    return null;
  }*/

  addBatch() {
    this.visible = false;
    this.newBatch = true;
    this.batch = new Batch();
    this.batch.batchOperation = this.batchOperation;

    // se foi informado na nota fiscal, preenche peneira e embalagem
    if (this.fiscalNote != null) {

      if (this.fiscalNote.strainer != null) {
        this.batch.strainer = this.fiscalNote.strainer
      }

      if (this.fiscalNote.packType != null) {
        this.batch.packType = this.fiscalNote.packType;
      }
    }

    // se a nota do romaneio tem certificado, o novo lote deve ser personalizado.
    if (this.isCertificated) {
      this.batch.typeCoffee = TypeCoffee.PERSONALIZADO.code;
    } else {
      this.batch.typeCoffee = TypeCoffee.NORMAL.code;
    }

    this.batches.push(this.batch);
    this.edit(this.batch);
    this.visible = true;
    /*return this.batchService
      .save(this.batch)
      .then((batch: Batch) => {
        Notification.success('Divisão de lote salva com sucesso!');
        this.reset();
        this.batch = batch;
        this.edit(this.batch);
        return this.loadList();
      })
      .catch(error => this.handleError(error));*/
  }

  save() {
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }
    this.loading = true;
    this.batch.batchCode = this.form.controls['batchCode'].value;
    this.batch.strainer = this.strainers.find(s => s.id === this.form.value.strainerId);
    this.batch.drink = this.drinks.find(d => d.id === this.form.value.drinkId);
    this.batch.impurityContent = this.form.value.impurityContent || 0;
    this.batch.moistureContentString = this.form.value.moistureContent;
    this.batch.unitType = this.form.value.unitType;
    this.batch.refClient = this.form.value.refClient;
    this.batch.packType = new PackType();
    this.batch.packType.id = this.form.value.packTypeId;
    this.batch.typeCoffee = this.form.value.typeCoffeeId;
    this.batch.contaminant = this.form.value.contaminant && this.form.value.contaminant.length > 0;
    this.batch.contaminants = this.form.value.contaminant && this.form.value.contaminant.map((c) => {
      return {id: c.id};
    });
    this.batch.netQuantity = this.form.value.netQuantity;
    
    if(this.form.value.netQuantity){
      this.batch.netQuantityTyped = true;
    }

    if (!this.batch.contaminant) {
      this.batch.contaminant = null;
    }

    if (!this.batch.contaminants) {
      this.batch.contaminants = null;
    }

    //this.batch.indKeepPack = this.form.value.indKeepPack;
    this.batch.receiveType = this.form.value.receiveType;
    this.batch.storageType = new PackType();
    this.batch.storageType.id = this.form.value.storageTypeId;
    this.batch.observation = this.form.value.observation;
    this.newBatch = false;
    return this.batchService
      .save(this.batch)
      .then(() => {
        Notification.success('Divisão de lote salva com sucesso!');
        this.batch = null;
        return this.loadList();
      })
      .catch(error => {
        this.handleError(error);
      });
  }

  cancel() {
    this.visible = false;
    if (!!this.batch && !this.batch.id) {
      this.batches = this.batches.filter(ba => !!ba.id);
      this.newBatch = false;
    }
    this.batch = null;
  }

  get totalNetQuantity() {
    if (!this.showTotals) {
      return '-';
    }

    return String(
      this.batches.map(b => b.netQuantity).reduce((a, b) => {
        if (!a) {
          return b;
        } else if (!b) {
          return a;
        } else {
          return a + b;
        }
      }, 0)
    );
  }

  get totalNetWeight(): string {
    if (!this.showTotals) {
      return '-';
    }

    return NumberHelper.toPTBR(
      this.batches.map(b => b.grossWeight - b.tareWeight).reduce((a, b) => {
        if (!a) {
          return b;
        } else if (!b) {
          return a;
        } else {
          return a + b;
        }
      }, 0)
    );
  }

  get showTotals() {
    let totalGross = this.batches
      .map(b => b.grossWeight)
      .reduce((a, b) => a + b, 0);
    let totalTare = this.batches
      .map(b => b.tareWeight)
      .reduce((a, b) => a + b, 0);

    return !!totalGross && !!totalTare;
  }

  loadList() {
    this.loading = true;
    this.batchService
      .list(this.batchOperation.id)
      .then(batches => {
        this.batches = batches;
        this.loading = false;
      })
      .catch(error => this.handleError(error));
  }

  delete(id: string | number) {
    if (this.batch && this.batch.id === id) {
      this.batch = null;
    }

    this.loading = true;
    return this.batchService
      .delete(this.batchOperation.id, id)
      .then(() => {
        Notification.success('Divisão de lote excluída com sucesso!');
        return this.loadList();
      })
      .catch(error => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  allowManualWeighing(batchOperation: BatchOperation) {
    return this.balanceTransportationInService.allowManualWeighing &&
      batchOperation.balanceWeightingMode === 'INDIVIDUAL' &&
      !this.newBatch;
  }

  allowManualSacks() {
    return this.balanceTransportationInService.allowManualWeighing &&
      !this.newBatch;
  }

  setEditGross(batch: Batch) {
    this.editGross = batch.id;
  }

  setEditTare(batch: Batch) {
    this.editTare = batch.id;
  }

  setEditNetQuantityValue(batch: Batch) {
    if(this.auth.isLeader)
      this.editNetQuantityValue = batch.id;
  }

  unsetEditGross() {
    this.editGross = null;
  }

  unsetEditTare() {
    this.editTare = null;
  }

  unsetNetQuantityValue() {
    this.editNetQuantityValue = null;
  }

  weighGross(batch: Batch) {
    let batchWeight = new BatchWeight();
    batchWeight.scale = this.balanceService.scale;
    batchWeight.batch = batch;
    batchWeight.type = 'GROSS';

    this.balanceService
      .saveBatchWeight(batchWeight)
      .then((response: Batch) => {
        batch.grossWeight = response.grossWeight;
        batch.averageWeightSack = response.averageWeightSack;
        this.balanceTransportationInService.batchOperation = null;
        this.unsetEditGross();
      })
      .then(() => this.loadList())
      .catch(error => {
        this.errorHandler.fromServer(error);
        this.loadList();
      });
  }

  saveGross(batch: Batch) {
    let batchWeight = new BatchWeight();
    batchWeight.batch = batch;
    batchWeight.weight = batch.grossWeight;
    batchWeight.type = 'GROSS';

    this.balanceService
      .saveBatchWeight(batchWeight)
      .then(response => {
        batch.grossWeight = response.grossWeight;
        batch.averageWeightSack = response.averageWeightSack;
        batch.netQuantity = response.netQuantity;
        this.balanceTransportationInService.batchOperation = null;
        this.unsetEditGross();
      })
      .then(() => this.loadList())
      .catch(error => {
        this.errorHandler.fromServer(error);
        this.loadList();
      });
  }

  weighTare(batch: Batch) {
    let batchWeight = new BatchWeight();
    batchWeight.scale = this.balanceService.scale;
    batchWeight.batch = batch;
    batchWeight.type = 'TARE';

    this.balanceService
      .saveBatchWeight(batchWeight)
      .then(response => {
        batch.tareWeight = response.tareWeight;
        batch.averageWeightSack = response.averageWeightSack;
        batch.netQuantity = response.netQuantity;
        this.balanceTransportationInService.batchOperation = null;
        this.unsetEditTare();
      })
      .then(() => this.loadList())
      .then(() => this.refreshBatchOperation.emit())
      .catch(error => {
        this.errorHandler.fromServer(error);
        this.loadList();
      });
  }

  saveTare(batch: Batch) {
    let batchWeight = new BatchWeight();
    batchWeight.batch = batch;
    batchWeight.weight = batch.tareWeight;
    batchWeight.type = 'TARE';

    this.balanceService
      .saveBatchWeight(batchWeight)
      .then(response => {
        batch.tareWeight = response.tareWeight;
        batch.averageWeightSack = response.averageWeightSack;
        batch.netQuantity = response.netQuantity;
        batch.averageWeightSack = response.averageWeightSack;
        this.balanceTransportationInService.batchOperation = null;
        this.unsetEditTare();
      })
      .then(() => this.loadList())
      .then(() => this.refreshBatchOperation.emit())
      .catch(error => {
        this.errorHandler.fromServer(error);
        this.loadList();
      });
  }

  saveNetQuantityValue(batch: Batch, netQuantityTyped: boolean) {
    batch.netQuantityTyped = netQuantityTyped;
    this.balanceService
      .saveNetQuantityValue(batch)
      .then(response => {
        this.editNetQuantityValue = false;
        batch.netQuantity = response.netQuantity;
        batch.averageWeightSack = response.averageWeightSack;
        this.balanceTransportationInService.batchOperation = null;
        this.unsetNetQuantityValue();
      })
      .then(() => this.loadList())
      .then(() => this.refreshBatchOperation.emit())
      .catch(error => {
        this.errorHandler.fromServer(error)
        this.loadList();
      });
  }

  loadTypeCoffee() {
    this.typeCoffee.push(TypeCoffee.NENHUM);
    this.typeCoffee.push(TypeCoffee.NORMAL);
    this.typeCoffee.push(TypeCoffee.PERSONALIZADO);
    this.typeCoffee.push(TypeCoffee.PREPARO);
  }

  receiving(batch: Batch) {
    this.batch = batch;
    this.batch.batchOperation = this.batchOperation;
    this.openBatchReceivingModal(AutomationTypeModal.fromData('RECEIVING'));
  }

  bagging(batch: Batch) {
    this.batch = batch;
    this.batch.batchOperation = this.batchOperation;
    this.openBatchReceivingModal(AutomationTypeModal.fromData('BAGGING'));
  }

  openBatchReceivingModal(type: AutomationTypeModal) {
    this.batchReceivingModalComponent.open(type);
  }

  allowTareWeightOf(i: number) {
    if (i === 0) {
      return true;
    }

    return !!this.batches[i - 1].tareWeight;
  }

  automationRouteModalCloseHandler() {
    this.batchReceivingModalComponent.close();
    this.visible = false;
    this.loadList();
  }

  storageUnitSacariaFormModalCloseHandler() {
    this.storageUnitSacariaFormModal.close();
    this.loadList();
  }

  allowMove(batch: Batch) {
    if (
      batch.storageType &&
      batch.storageType.genericType === GenericType.SACAS.code
    ) {
      return false;
    }

    return (
      !this.readOnly &&
      !!batch.grossWeight &&
      [BatchStatus.OPEN.code, BatchStatus.RECEIVING.code].includes(batch.status)
    );
  }

  allowReceiveSacaria(batch: Batch) {
    if (
      !batch.storageType ||
      batch.storageType.genericType !== GenericType.SACAS.code
    ) {
      return false;
    }

    return (
      !this.readOnly &&
      !!batch.grossWeight &&
      [BatchStatus.OPEN.code, BatchStatus.RECEIVING.code].includes(batch.status)
    );
  }

  isBatchEditing(batch: Batch) {
    if (!this.visible) {
      return false;
    }

    if (!this.batch || !this.batch.id) {
      return false;
    }

    if (!batch || !batch.id) {
      return false;
    }

    return this.batch.id === batch.id;
  }

  loadRecalculateList() {
    return this.batchService
      .recalculateList(this.batchOperation.id)
      .then(batches => {
        this.batches = batches;
        this.loading = false;
      })
      .catch(error => {
        this.loadList();
        this.handleError(error);
      });
  }

  get weighingMode() {
    return this.balanceTransportationInService.weighingMode;
  }

  convertToPattern(data) {
    return data.map(item => {
      return {id: item.id, text: item.name + (item.allergenic ? ' (alerg.)': '')};
    });
  }

}
