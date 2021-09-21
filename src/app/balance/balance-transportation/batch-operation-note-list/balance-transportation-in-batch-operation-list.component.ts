import { Masks } from '../../../shared/forms/masks/masks';
import { BalanceService } from '../../balance.service';
import { BatchOperation } from '../../../batch-operation/batch-operation';
import { BatchOperationService } from '../../../batch-operation/batch-operation.service';
import { ErrorHandler } from '../../../shared/errors/error-handler';
import { ModalManager } from '../../../shared/modals/modal-manager';
import { BalanceTransportationInService } from '../balance-transportation-in.service';

import {Component, OnDestroy, OnInit} from '@angular/core';
import { BatchOperationWeight } from '../../../batch-operation/batch-operation-weight';
import { NavigationExtras, Router } from '../../../../../node_modules/@angular/router';
import { AuthService } from '../../../auth/auth.service';
import {TransportationService} from "../../../transportation/transportation.service";
import {TransportationStatus} from "../../../transportation/transportation-status";
import {Transportation} from "../../../transportation/transportation";
import {NumberHelper} from "../../../shared/globalization";
import {Notification} from "../../../shared/notification";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CustomValidators} from "../../../shared/forms/validators/custom-validators";
import {FiscalNote} from "../../../fiscal-note/fiscal-note";
import {TransportationFiscalNoteService} from "../../../transportation/transportation-fiscal-note/transportation-fiscal-note.service";
import {KilosSacksConverterService} from "../../../shared/kilos-sacks-converter/kilos-sacks-converter.service";
import {ParameterService} from "../../../parameter/parameter.service";
import {WarehouseStakeholderService} from "../../../warehouse-stakeholder/warehouse-stakeholder.service";
import {CollaboratorAutocomplete} from "../../../collaborator/collaborator-autocomplete";
import {CollaboratorService} from "../../../collaborator/collaborator.service";
import {WarehouseStakeholderAutocomplete} from "../../../warehouse-stakeholder/warehouse-stakeholder-autocomplete";
import {Subscription} from "rxjs";
import {CollaboratorPropertyService} from "../../../collaborator-property/collaborator-property.service";
import {Farm} from "../../../farm/farm";

@Component({
	selector: 'app-balance-transportation-in-batch-operation-list',
	templateUrl: 'balance-transportation-in-batch-operation-list.component.html'
})
export class BalanceTransportationInBatchOperationListComponent  implements OnInit, OnDestroy {
	deleteConfirm = new ModalManager();
	recalculateConfirm = new ModalManager();
	loading = false;
	downloadLoading = false;
	decimalMask = Masks.decimalMask;
	integerMask = Masks.integerMask;
  dateMask = Masks.dateMask;
	private editSacksQuantity;
	private editGross;
	private editTare;
	recalculate = false;
  optionRequestFiscalNoteModal = new ModalManager();
  formFiscalNote: FormGroup;
  fiscalNote: FiscalNote;
  batchOperationFiscalNote: BatchOperation;
  replaceStakeholderForCollaborator = false;
  collaboratorAutocomplete: CollaboratorAutocomplete;
  ownerAutocomplete: WarehouseStakeholderAutocomplete;
  senderAutocomplete: WarehouseStakeholderAutocomplete;
  collaboratorSubscription: Subscription;
  ownerSubscription: Subscription;
  senderSubscription: Subscription;
  // tempo de espera para requisições em segundos
  debounceTimeValue: number = 2000;
  farms: Array<Farm> = [];

	constructor(
		private balanceTransportationInService: BalanceTransportationInService,
    private kilosSacksConverterService: KilosSacksConverterService,
		private transportationService: TransportationService,
		private batchOperationService: BatchOperationService,
    private collaboratorPropertyService: CollaboratorPropertyService,
		private balanceService: BalanceService,
    private parameterService: ParameterService,
    private warehouseStakeholderService: WarehouseStakeholderService,
    private collaboratorService: CollaboratorService,
		private errorHandler: ErrorHandler,
		private router: Router,
    private formBuilder: FormBuilder,
		private auth: AuthService
	) { }

	ngOnInit() {
	  this.fillFiscalNoteEmpty();

		this.balanceService.weighingMode().then(mode => {
			this.balanceTransportationInService.weighingMode = mode;
		});

    this.parameterService
      .replaceStakeholderForCollaborator()
      .then(replaceStakeholderForCollaborator => {
        this.replaceStakeholderForCollaborator = replaceStakeholderForCollaborator;
      });

    this.collaboratorAutocomplete = new CollaboratorAutocomplete(
      this.collaboratorService,
      this.errorHandler
    );

    this.ownerAutocomplete = new WarehouseStakeholderAutocomplete(
      this.warehouseStakeholderService,
      this.errorHandler
    );

    this.senderAutocomplete = new WarehouseStakeholderAutocomplete(
      this.warehouseStakeholderService,
      this.errorHandler
    );

    this.buildForm();
  }

	get batchOperations() {
		return this.balanceTransportationInService.batchOperations;
	}

	get transportation(){
    return this.balanceTransportationInService.transportation;
  }


	allowTareWeight(batchOperation: BatchOperation) {
		if (batchOperation.balanceWeightingMode !== 'INDIVIDUAL') {
			return false;
		}

		return !!batchOperation.grossWeight;
	}

	delete(id: string) {
		return this.batchOperationService
			.delete(id)
			.then(() => {
				return this.balanceTransportationInService
					.refreshFiscalNotes()
					.then(() => {
						this.loading = false;
					});
			})
			.catch(error => {
				this.handleError(error);
			});
	}

	fiscalNotesOf(batchOperation: BatchOperation) {
		return this.balanceTransportationInService
			.fiscalNotesOf(batchOperation)
			.map(fiscalNote => fiscalNote.code)
			.join(', ');
	}

	handleError(error) {
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}

	onDeleteClick(event: Event, id: string) {
		event.stopPropagation();
		this.deleteConfirm.open(id);
	}

	select(batchOperation: BatchOperation) {
		this.balanceTransportationInService.select(batchOperation);
	}

	isSelected(batchOperation: BatchOperation) {
		if (!this.balanceTransportationInService.batchOperation) {
			return false;
		}

		return (
			batchOperation.id ===
			this.balanceTransportationInService.batchOperation.id
		);
	}

	downloadInternControl(event: Event, id: string) {
		event.stopPropagation();
		this.downloadLoading = true;
		return this.batchOperationService
			.downloadInternControl(id)
			.then(() => {
				this.downloadLoading = false;
			})
			.catch(error => {
				console.error(error);
				this.downloadLoading = false;
			});
	}

	downloadWeightTicket(event: Event, id: string) {
		event.stopPropagation();
		this.downloadLoading = true;
		return this.balanceService
			.downloadWeightTicketIndividual(id)
			.then(() => {
				this.downloadLoading = false;
			})
			.catch(error => {
				console.error(error);
				this.downloadLoading = false;
			});
	}

	get allowManualWeighing() {
		return this.balanceTransportationInService.allowManualWeighing;
	}

	setEditSacksQuantity(batchOperation: BatchOperation) {
		if ((this.isLeader() || this.isAdmin())) {
			this.editSacksQuantity = batchOperation.id;
		}
	}

	setEditGross(batchOperation: BatchOperation) {
		if ((this.isLeader() || this.isAdmin()) && batchOperation.balanceWeightingMode === 'INDIVIDUAL') {
			this.editGross = batchOperation.id;
		}
	}

	setEditTare(batchOperation: BatchOperation) {
		if ((this.isLeader() || this.isAdmin()) && batchOperation.balanceWeightingMode === 'INDIVIDUAL') {
			this.editTare = batchOperation.id;
		}
	}

	unsetEditSacksQuantity() {
		this.editSacksQuantity = null;
	}

	unsetEditGross() {
		this.editGross = null;
	}

	unsetEditTare() {
		this.editTare = null;
	}

	weighGross(batchOperation: BatchOperation) {
		let batchOperationWeight = new BatchOperationWeight();
		batchOperationWeight.scale = this.balanceService.scale;
		batchOperationWeight.listBatchOperations = [batchOperation];
		batchOperationWeight.type = 'GROSS';

    this.balanceService
			.saveWeight(batchOperationWeight)
			.then(response => {
				batchOperation.grossWeight = response.weight;
				this.balanceTransportationInService.batchOperation = null;
				this.balanceTransportationInService.refreshFiscalNotesAndSelectBatchOperation(
					batchOperationWeight.listBatchOperations[0]
				);
			})
			.catch(error => this.errorHandler.fromServer(error));
	}

	saveSacksQuantity(
		batchOperation: BatchOperation,
		sacksQuantityTyped: boolean
	) {

		batchOperation.sacksQuantityTyped = sacksQuantityTyped;

		this.balanceService
			.saveSacksQuantity(batchOperation)
			.then(response => {
				this.editSacksQuantity = false;
				this.balanceTransportationInService.batchOperation = null;
				this.balanceTransportationInService.refreshFiscalNotesAndSelectBatchOperation(
					batchOperation
				);
			})
			.catch(error => this.errorHandler.fromServer(error));
	}

	saveGross(batchOperation: BatchOperation) {
		let batchOperationWeight = new BatchOperationWeight();
		batchOperationWeight.listBatchOperations = [batchOperation];
		batchOperationWeight.weight = batchOperation.grossWeight;
		batchOperationWeight.type = 'GROSS';
		batchOperationWeight.manual = true;

		this.balanceService.saveWeight(batchOperationWeight).then(responses => {

				this.editGross = false;
				batchOperation.grossWeight = responses.weight;
				this.balanceTransportationInService.batchOperation = null;
				this.balanceTransportationInService.refreshFiscalNotesAndSelectBatchOperation(
					batchOperationWeight.listBatchOperations[0]
				);
			})
			.catch(error => this.errorHandler.fromServer(error));
	}

	weighTare(batchOperation: BatchOperation) {
		let batchOperationWeight = new BatchOperationWeight();
		batchOperationWeight.scale = this.balanceService.scale;
		batchOperationWeight.listBatchOperations = [batchOperation];
		batchOperationWeight.type = 'TARE';

		this.balanceService
			.saveWeight(batchOperationWeight)
			.then(response => {
				this.editTare = false;
				batchOperation.tara = response.weight;
				this.balanceTransportationInService.batchOperation = null;
				this.balanceTransportationInService.refreshFiscalNotesAndSelectBatchOperation(
					batchOperationWeight.listBatchOperations[0]
				);
			})
			.catch(error => this.errorHandler.fromServer(error));
	}

	saveTare(batchOperation: BatchOperation) {
		let batchOperationWeight = new BatchOperationWeight();
		batchOperationWeight.listBatchOperations = [batchOperation];
		batchOperationWeight.weight = batchOperation.tara;
		batchOperationWeight.type = 'TARE';
		batchOperationWeight.manual = true;

		this.balanceService
			.saveWeight(batchOperationWeight)
			.then(response => {
				this.editTare = false;
				batchOperation.tara = response.weight;
				this.balanceTransportationInService.batchOperation = null;
				this.balanceTransportationInService.refreshFiscalNotesAndSelectBatchOperation(
					batchOperationWeight.listBatchOperations[0]
				);
			})
			.catch(error => this.errorHandler.fromServer(error));
	}

	onRecalculateClick(event: Event, id: string) {
		event.stopPropagation();
		this.recalculateConfirm.open(id);
	}

	redirectBatchWeighingShare(batchOperationId: string) {
		this.router.navigate(['/balance/batch-weighing-share', batchOperationId], { queryParams: { recalculate: true } });
	}

	isRecalculateIsAvailable(batchOperation: BatchOperation) {
		if (!this.auth.findParameterBoolean('BATCH_OPERATION_RECALCULATE_BATCHES')) {
			return false;
		}
		if (!batchOperation) {
			return false;
		}
		if (batchOperation.grossWeightString === '0,00') {
			return false;
		}
		if (batchOperation.taraString === '0,00') {
			return false;
		}
		return true;
	}

	isAdmin() {
		return this.auth.isAdmin;
	}

	isLeader() {
		return this.auth.accessToken.leader;
	}

  openCreateFiscalNote(batchOperation: BatchOperation) {
    this.batchOperationFiscalNote = batchOperation;
    this.optionRequestFiscalNoteModal.open(null);
  }

  buildForm() {
    this.formFiscalNote = this.formBuilder.group({
      fiscalNoteNumber: [
        this.fiscalNote ? this.fiscalNote.code || '' : '',
        [Validators.required]
      ],
      fiscalNoteSerie: [this.fiscalNote ? this.fiscalNote.serie || '' : '', []],
      fiscalNoteDate: [
        this.fiscalNote ? this.fiscalNote.emissionDateString || '' : '',
        [Validators.required]
      ],
      fiscalNoteValue: [
        this.fiscalNote ? this.fiscalNote.totalPrice || '' : '',
        [Validators.required]
      ],
      fiscalNoteQuantity: [
        this.fiscalNote ? this.fiscalNote.quantity || '' : '',
        [Validators.required]
      ],
      collaboratorId: new FormControl(
        this.fiscalNote.collaborator
          ? this.fiscalNote.collaborator.id || ''
          : '',
        this.replaceStakeholderForCollaborator ? Validators.required : null
      ),
      farmId: new FormControl(
        this.fiscalNote.farm ? this.fiscalNote.farm.id || '' : '',
        this.replaceStakeholderForCollaborator ? Validators.required : null
      ),
      collaboratorRegistration: [
        this.fiscalNote.collaborator
          ? this.fiscalNote.collaborator.registration || ''
          : ''
      ],
      netWeightString: [this.fiscalNote.netWeightString || '0'],
      senderStakeholderId: [
        this.fiscalNote.senderStakeholder
          ? this.fiscalNote.senderStakeholder.id || ''
          : '',
        !this.replaceStakeholderForCollaborator ? Validators.required : null
      ],
      ownerStakeholderId: [
        this.fiscalNote.ownerStakeholder
          ? this.fiscalNote.ownerStakeholder.id || ''
          : '',
        !this.replaceStakeholderForCollaborator ? Validators.required : null
      ]
    });

    this.collaboratorPropertyService
      .listFarmsBycollaborator(this.formFiscalNote.value.collaboratorId)
      .then(farms => {
        this.farms = farms;
      });

    this.collaboratorAutocomplete.value = this.fiscalNote.collaborator;

    this.collaboratorSubscription = this.collaboratorAutocomplete.valueChange.debounceTime(this.debounceTimeValue).subscribe(
      value => {
        const id = value ? value.id : null;
        this.formFiscalNote.get('collaboratorId').setValue(id);

        // busca fazendas do cliente (as ordens de compra são buscadas em função dentro do campo do cliente)
        this.collaboratorPropertyService.listFarmsBycollaborator(id).then(farms => {
          this.farms = farms;
        });
      }
    );

    this.ownerAutocomplete.value = this.fiscalNote.ownerStakeholder;

    this.ownerSubscription = this.ownerAutocomplete.valueChange.debounceTime(this.debounceTimeValue).subscribe(
      value => {
        const id = value ? value.id : null;
        this.formFiscalNote.get('ownerStakeholderId').setValue(id);
      }
    );

    this.senderAutocomplete.value = this.fiscalNote.senderStakeholder;

    this.senderSubscription = this.senderAutocomplete.valueChange.debounceTime(this.debounceTimeValue).subscribe(
      value => {
        const id = value ? value.id : null;
        this.formFiscalNote.get('senderStakeholderId').setValue(id);
      }
    );
  }

  addFiscalNote() {
    Object.keys(this.formFiscalNote.controls).forEach((key) => {
      this.formFiscalNote.controls[key].markAsDirty();
    });

    if (!this.formFiscalNote.valid) {
      return;
    }

    this.loading = true;

    if (!this.fiscalNote) {
      this.fillFiscalNoteEmpty()
      this.fiscalNote.grossWeight = 0.00;
      this.fiscalNote.netWeight = 0.00;
      this.fiscalNote.barCode = null;
      this.fiscalNote.baseValueForTax = 0.00;
      this.fiscalNote.taxIcmsPercent = 0.00;
      this.fiscalNote.unitPrice = 0.00;
    }
    this.fiscalNote.noteType = "TRANSPORTATION_IN";
    this.fiscalNote.code = this.formFiscalNote.get('fiscalNoteNumber').value;
    this.fiscalNote.totalPrice = + NumberHelper.fromPTBR(this.formFiscalNote.get('fiscalNoteValue').value);
    this.fiscalNote.emissionDateString = this.formFiscalNote.get('fiscalNoteDate').value;
    this.fiscalNote.batchOperation = this.batchOperationFiscalNote;
    this.fiscalNote.transportation = this.transportation;
    this.fiscalNote.serie = this.formFiscalNote.get('fiscalNoteSerie').value;
    this.fiscalNote.quantity = this.formFiscalNote.get('fiscalNoteQuantity').value;
    this.fiscalNote.collaborator = this.collaboratorAutocomplete.value;
    this.fiscalNote.farm = this.farms.find(f => f.id === this.formFiscalNote.value.farmId);
    this.fiscalNote.senderStakeholder = this.senderAutocomplete.value;
    this.fiscalNote.ownerStakeholder = this.ownerAutocomplete.value;

    if (this.replaceStakeholderForCollaborator) {
      return this.warehouseStakeholderService
        .findByPerson(this.fiscalNote.collaborator.person.id)
        .then(stakeholder => {
          this.fiscalNote.senderStakeholder = stakeholder;
          this.fiscalNote.ownerStakeholder = stakeholder;
          this.saveFiscalNote(this.fiscalNote);
        }).catch(() => {
          this.saveFiscalNote(this.fiscalNote);
        });
    }
    else {
      this.saveFiscalNote(this.fiscalNote);
    }
  }

  saveFiscalNote(fiscalNote:any) {
    if(!this.fiscalNote.id) {
      //Trocar por outro método que insira nota fiscal de entrada.
      this.balanceTransportationInService.insertFiscalNoteByBatchOperation(this.fiscalNote)
        .then(fiscal => {
          this.loading = false;
          this.fillFiscalNoteEmpty()
          this.buildForm();
          (<any>jQuery)('.modal').modal('hide');
        })
        .catch(error => {
          this.handleError(error);
          (<any>jQuery)('.modal').modal('hide');
        })
    }
  }

  fillFiscalNoteEmpty() {
    this.fiscalNote = new FiscalNote(
      undefined,
      '',
      '',
      0,
      0,
      '',
      null,
      null,
      0,
      null,
      null,
      null,
      '',
      0,
      0,
      0,
      0,
      0,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    );
  }

  get quantityNetWeight() {
    return (this.formFiscalNote.value.fiscalNoteQuantity * this.kilosSacksConverterService.sacksInKilos);
  }

  setFiscalNoteValueInput() {
    this.formFiscalNote.get('fiscalNoteValue').setValue(NumberHelper.toPTBR(this.formFiscalNote.value.fiscalNoteValue));
  }

  clearSubscriptions() {
    const subscriptions = [
      this.collaboratorSubscription,
      this.ownerSubscription,
      this.senderSubscription
    ];

    subscriptions.forEach(subscription => {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
  }

  ngOnDestroy() {
    this.clearSubscriptions();
  }
}
