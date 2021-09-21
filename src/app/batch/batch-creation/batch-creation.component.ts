import { BatchStatus } from '../batch-status';
import { AutomationTypeModal } from '../../automation-route/automation-route-modal-type';
import { BatchOperationStatus } from '../../batch-operation/batch-operation-status';
import { NumberHelper } from '../../shared/globalization';
import { Masks } from '../../shared/forms/masks/masks';
import { Page } from '../../shared/page/page';
import { ModalManager } from '../../shared/modals/modal-manager';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Notification } from '../../shared/notification';
import { BatchService } from '../batch.service';
import { Drink } from '../../drink/drink';
import { DrinkService } from '../../drink/drink.service';
import { CustomValidators } from '../../shared/forms/validators/custom-validators';
import { Batch } from '../batch';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { StrainerService } from '../../strainer/strainer.service';
import { Strainer } from '../../strainer/strainer';
import { BatchOperation } from '../../batch-operation/batch-operation';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GenericType } from '../../pack-type/generic-type';
import { BatchReceiveType } from '../batch-receive-type';
import { TypeCoffee } from 'app/pack-type/type-coffee';
import { AuthService } from 'app/auth/auth.service';
import { PackType } from 'app/pack-type/pack-type';
import { PackTypeService } from 'app/pack-type/pack-type.service';
import { FiscalNote } from 'app/fiscal-note/fiscal-note';
import { TransportationFiscalNoteService } from 'app/transportation/transportation-fiscal-note/transportation-fiscal-note.service';
import { BatchOperationType } from 'app/batch-operation/batch-operation-type';
import { KilosSacksConverterService } from 'app/shared/kilos-sacks-converter/kilos-sacks-converter.service';
import { ParameterService } from 'app/parameter/parameter.service';
import {MarkupGroupService} from "../../markup-group/markup-group.service";
import {MarkupGroupType} from "../../markup-group/markup-group-type";
import {MarkupGroupBatch} from "../../markup-group/batch/markup-group-batch";
import {Contaminant} from "../../contaminant/contaminant";
import {ContaminantService} from "../../contaminant/contaminant.service";
import {PackStockService} from "../../pack-stock/pack-stock.service";

@Component({
	selector: 'app-batch-creation',
	templateUrl: 'batch-creation.component.html'
})
export class BatchCreationComponent implements OnInit, OnDestroy {
	@Input() batchOperation: BatchOperation;
	form: FormGroup;
	strainers: Array<Strainer>;
	drinks: Array<Drink>;
	batch: Batch;
	markupGroupBatchs: Array<MarkupGroupBatch>;
	batches: Array<Batch>;
	loading = false;
	deleteConfirm: ModalManager = new ModalManager();
	reopenConfirm: ModalManager = new ModalManager();
	automationRouteModalComponent = new ModalManager();
	storageUnitSacariaFormModal = new ModalManager();
  storageUnitSetFormModal = new ModalManager();
	integerMask = Masks.integerMask;
	decimalMask = Masks.decimalMask;
	packTypes: Array<PackType>;
	page: Page<Batch> = new Page<Batch>();
	typeCoffee: Array<TypeCoffee> = [];
	contaminants: Array<Contaminant> = [];
	receiveTypes = BatchReceiveType.list();
	// nota fiscal do batch operation
	fiscalNote: FiscalNote = null;
	batchOperationWIN = BatchOperationType.W_IN.code;
	batchStatusReceived = BatchStatus.RECEIVED.code;
	specificParamsServiceInstructionWahehouseGeneral: boolean = true;
	showBatchDivisionForm: boolean = true;

	private hiddenPackingData = false;

	constructor(
		private strainerService: StrainerService,
		private drinkService: DrinkService,
		private batchService: BatchService,
		private formBuilder: FormBuilder,
		private errorHandler: ErrorHandler,
		private auth: AuthService,
		private packTypeService: PackTypeService,
		private fiscalNoteService: TransportationFiscalNoteService,
		private kilosSacksConverterService: KilosSacksConverterService,
		private parameterService: ParameterService,
		private markupGroupService: MarkupGroupService,
		private contaminantService: ContaminantService,
		private packStockService: PackStockService
	) { }

	get readOnly() {
		return (this.batchOperation.status && this.batchOperation.status === BatchOperationStatus.CLOSED.code
		);
	}

	ngOnInit() {

		this.specificParamsServiceInstructionWahehouseGeneral = this.parameterService.specificParamsServiceInstructionWahehouseGeneral();

		this.packStockService.hiddenPackingData().then((res) => {
			this.hiddenPackingData = res;
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

		this.loadFiscalNoteFromBatchOperation();

    if(this.batchOperation.typeObject.code == this.batchOperationWIN){
      this.showBatchDivisionForm = false;
    }

		this.reset();
		this.loadList();
		this.loadTypeCoffee();
	}

	ngOnDestroy() {
		this.page.changeQuery.unsubscribe();
	}

	/**
	 * Carrega informações da ordem de compra se houver, para colocar no batch por padrão (na criação)
	 */
	loadFiscalNoteFromBatchOperation() {
		if (this.fiscalNote == null) {
			this.fiscalNoteService.listFiscalNoteByBatchOperation(this.batchOperation.id).then(fiscalNotes => {
				if (fiscalNotes != null && fiscalNotes.length > 0) {
					this.fiscalNote = fiscalNotes[0];
					this.reset();
				}
			});
		}
	}

	reset() {
		this.batch = new Batch();
		this.batch.batchOperation = this.batchOperation;
		this.buildForm();
		// limpa campo de quantidade que por algum motivo desconhecido,
		// ás vezes coloca underline _ no mesmo, após o reset.
	}

	edit(batch: Batch) {
		this.batch = batch;
		this.batch.batchOperation = this.batchOperation;
		this.buildForm();
		this.showBatchDivisionForm = true;
	}

	buildForm() {

		// se foi informado na nota fiscal, preenche peneira e embalagem (na edição não)
		if (this.fiscalNote != null && this.batch.id == null) {

			if (this.fiscalNote.strainer != null) {
				this.batch.strainer = this.fiscalNote.strainer;
			}

			if (this.fiscalNote.packType != null) {
				this.batch.packType = this.fiscalNote.packType;
			}
		}

		this.form = this.formBuilder.group({
			strainerId: [this.batch.strainer ? this.batch.strainer.id || '' : ''],
			drinkId: [this.batch.drink ? this.batch.drink.id || '' : ''],
			// 'impurityContent': [this.batch.impurityContent || ''],
			moistureContent: [this.batch.moistureContentString || ''],
			refClient: [this.batch.refClient || ''],
			netQuantity: [
			  this.batch.netQuantity || '',
        [
          Validators.required,
          this.batch.netQuantity ?
            CustomValidators.minValidator(this.batch.netQuantity) :
            CustomValidators.minValidator(1)
        ]
      ],
			netWeight: [this.batch.netWeightString || '', [Validators.required]],
			unitType: [this.batch.unitType || 'SC', [Validators.required]],
			batchCode: [this.batch.batchCode || ''],
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
				this.batch.typeCoffee ? this.batch.typeCoffee : TypeCoffee.NORMAL.code,
				[Validators.required]
			],
			// contaminant: [this.batch.contaminant || false],
      contaminant: [this.batch.contaminants && this.batch.contaminants.length &&  this.batch.contaminants.map((c) => {
        return {id: c.id, text: c.name + (c.allergenic ? ' (alerg.)': '')};
      })],
			receiveType: [
				this.batch.receiveType || BatchReceiveType.NORMAL.code,
				[
					Validators.required,
					this.hasPermissionForBatchCodeChangeValidation.bind(this)
				]
			],
			observation: [this.batch.observation ? this.batch.observation || '' : ''],
		});
    if(this.batchOperation.typeObject.code == this.batchOperationWIN){
      this.form.get('unitType').disable();
    }
	}

	/**
	 * Converte sacas para quantidade em peso para exibição
	 */
	convertSacksToWeight() {
		// utiliza peso médio da instrução para serviço, se o parâmetro for para armazém geral
		let sacksInKilos: number = (this.specificParamsServiceInstructionWahehouseGeneral
			&& this.batchOperation.serviceInstruction != null && this.batchOperation.serviceInstruction.averageWeightBag)
			? this.batchOperation.serviceInstruction.averageWeightBag
			: 0;
		let netQuantity = this.form.value.netQuantity;
		let kg = this.kilosSacksConverterService.sacksToKilos(netQuantity, null, sacksInKilos);
		this.form.get('netWeight').setValue(kg);
	}

	/**
	 * Converte peso em sacas
	 */
	convertWeightToSacks() {
		// converte string para número, para converter em sacas
		let netWeight = this.form.value.netWeight;
		let netWeightNumber: number = NumberHelper.fromPTBR(netWeight);
		let sacks: number = this.kilosSacksConverterService.kilosToSacks(netWeightNumber);
		this.form.get('netQuantity').setValue(sacks);
	}

	save() {

		if (this.batchOperation.type === BatchOperationType.P_IN.code) {
			this.form.controls['packTypeId'].disable();
			/*let parameterValue = this.auth.findParameterValue('STANDARD_STORAGE_PACKAGING');
			parameterValue = parameterValue !== null && parameterValue.length > 0 ? parameterValue : 'BIG BAG 25 Sacas';
			let packType = this.packTypes.find(type => type.description === parameterValue);
			if (packType) {
				this.batch.packType = packType;
				this.form.controls['packTypeId'].setValue(packType.id);
				this.batch.storageType = packType;
				this.form.controls['storageTypeId'].setValue(packType.id);
			}*/
		} else
			this.form.controls['packTypeId'].enable();

		Object.keys(this.form.controls).forEach(key => {
			this.form.controls[key].markAsDirty();
		});

		if (!this.form.valid) {
			return;
		}

		this.loading = true;
		this.batch.strainer = this.strainers.find(s => s.id === this.form.value.strainerId);
		this.batch.drink = this.drinks.find(d => d.id === this.form.value.drinkId);
		this.batch.impurityContent = this.form.value.impurityContent || 0;
		this.batch.moistureContentString = this.form.value.moistureContent;
		this.batch.netQuantity = this.form.value.netQuantity;
		this.batch.unitType = this.form.value.unitType;
		this.batch.refClient = this.form.value.refClient;
		this.batch.packType = new PackType();
		this.batch.packType.id = this.form.value.packTypeId;
		this.batch.typeCoffee = this.form.value.typeCoffeeId;
		this.batch.netWeight = NumberHelper.fromPTBR(this.form.value.netWeight);
		this.batch.grossWeight = this.batch.netWeight;
		//this.batch.indKeepPack = this.form.value.indKeepPack;
		this.batch.receiveType = this.form.value.receiveType;
		this.batch.storageType = new PackType();
		this.batch.storageType.id = this.form.value.storageTypeId;
		this.batch.observation = this.form.value.observation;
		this.batch.batchOperation.batches = null;
    this.batch.contaminants = this.form.value.contaminant && this.form.value.contaminant.map((c) => {
      this.batch.contaminant = true;
      return {id: c.id};
    });

    if (!this.batch.contaminants) {
      this.batch.contaminants = null;
    }

		if(!!this.form.value.batchCode)
			this.batch.batchCode = this.form.value.batchCode;

		return this.batchService.save(this.batch).then(() => {
			Notification.success('Divisão de lote salva com sucesso!');
			this.reset();
			return this.loadList();
		}).catch(error => this.handleError(error));
	}

	loadList() {
		this.loading = true;
		this.batchService.list(this.batchOperation.id).then(batches => {
			this.batches = batches;
			// atribui batches para o batch operation, para ter esses dados na tela principal
			this.batchOperation.batches = this.batches;
			this.loading = false;
		}).catch(error => this.handleError(error));
	}

	delete(id: string) {

		this.markupGroupService.listMarkupGroupBatchByBatchId(id).then(markupGroupBatchs => {
			this.markupGroupBatchs = markupGroupBatchs;
			let hasNotGeneric: boolean = false;
			if (this.markupGroupBatchs)
			{
				this.markupGroupBatchs.forEach((markupGroupBatch) => {
					if(markupGroupBatch.markupGroup.type != MarkupGroupType.GENERIC.code)
					{
						hasNotGeneric = true;
					}
				});
			}

			if(hasNotGeneric)
			{
				Notification.error('Esse lote não pode ser excluído pois está vinculado a Autorização de Embarque!');
				return;
			}

			if (this.batch && this.batch.id === id) {
				this.reset();
			}

			this.loading = true;
			return this.batchService.delete(this.batchOperation.id, id).then(() => {
				Notification.success('Divisão de lote excluída com sucesso!');
				return this.loadList();
			}).catch(error => this.handleError(error));
		});
	}

	reopen(id: string){
	  return this.batchService.reopen(id).then(()=>{
      Notification.success('Lote reaberto com sucesso!');
      return this.loadList();
    }).catch(()=>{
      Notification.error('Não foi possível reabrir o lote!');
    });
  }

	handleError(error) {
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}

	automationRouteModalCloseHandler() {
		this.automationRouteModalComponent.close();
	}

	allowMove(batch: Batch) {
		if (batch.storageType && batch.storageType.genericType === GenericType.SACAS.code) {
			return false;
		}

		return (!!batch.grossWeight &&
			[BatchStatus.OPEN.code, BatchStatus.RECEIVING.code].includes(batch.status)
		);
	}

	allowStorageUnits(batch: Batch) {
		return !(batch.storageType && batch.storageType.genericType === GenericType.SACAS.code
		);
	}

	allowReceiveSacaria(batch: Batch) {
		if (!batch.storageType || batch.storageType.genericType !== GenericType.SACAS.code) {
			return false;
		}

		return (!this.readOnly &&
			!!batch.grossWeight &&
			[BatchStatus.OPEN.code, BatchStatus.RECEIVING.code].includes(batch.status)
		);
	}

	storageUnitSacariaFormModalCloseHandler() {
		this.storageUnitSacariaFormModal.close();
		this.loadList();
	}

  storageUnitSetFormModalCloseHandler() {
    this.storageUnitSetFormModal.close();
  }

  received(batch: Batch) {
	  return batch.statusObject.code === BatchStatus.RECEIVED.code
      && (this.batchOperation.statusObject.code !== BatchOperationStatus.STORED.code
      && this.batchOperation.statusObject.code !== BatchOperationStatus.AUDITING.code);
  }

	receiving(batch: Batch) {
		this.automationRouteModalComponent.open({
			batch,
			type: AutomationTypeModal.RECEIVING
		});
	}

	bagging(batch: Batch) {
		this.automationRouteModalComponent.open({
			batch,
			type: AutomationTypeModal.BAGGING
		});
	}

  get totalNetQuantity() {
	  let total = this.batches.map(b => b.netQuantity)
      .reduce((a, b) => a + b, 0);
    return total || 0;
	}

  get totalNetWeightCalcString() {
    let total = this.batches.map(b => !this.hiddenPackingData && b.indDiscountPack
      ? b.netWeight - (b.packQuantity * b.packType.weight)
      : b.netWeight)
      .reduce((a, b) => a + b, 0);
    return NumberHelper.toPTBR(total);
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
			return { noPermissionForSacaria: true };
		}

		return null;
	}

	hasPermissionForBatchCodeChangeValidation(control: AbstractControl) {
		const hasPermission =
			this.auth.accessToken.admin || this.auth.accessToken.leader;
		const value = control.value;

		if (!hasPermission && value !== BatchReceiveType.NORMAL.code) {
			return { noPermissionForBatchCodeChange: true };
		}

		return null;
	}

	isAdminForTransfer(){
	  return this.batchOperation.type === 'OT_IN' ? (this.auth.accessToken.admin || this.auth.accessToken.leader) : true;
  }

	loadTypeCoffee() {
		this.typeCoffee.push(TypeCoffee.NENHUM);
		this.typeCoffee.push(TypeCoffee.NORMAL);
		this.typeCoffee.push(TypeCoffee.PERSONALIZADO);
		this.typeCoffee.push(TypeCoffee.PREPARO);
	}

	calcBalance(batch:Batch) {
		if (!this.hiddenPackingData && batch.indDiscountPack) {
			return NumberHelper.toPTBR(batch.netWeight - (batch.packQuantity * batch.packType.weight) );
		}
		return batch.balanceString;
	}

  convertToPattern(data) {
    return data.map(item => {
      return {id: item.id, text: item.name + (item.allergenic ? ' (alerg.)': '')};
    });
  }
}
