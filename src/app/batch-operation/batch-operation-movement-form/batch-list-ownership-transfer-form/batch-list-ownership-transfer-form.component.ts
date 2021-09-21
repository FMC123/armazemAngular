import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ModalManager } from '../../../shared/modals/modal-manager';
import { Notification } from '../../../shared/notification';
import { Masks } from '../../../shared/forms/masks/masks';
import { ErrorHandler } from '../../../shared/errors/error-handler';
import { TransportationFiscalNoteService } from '../../../transportation/transportation-fiscal-note/transportation-fiscal-note.service';
import { NumberHelper } from "../../../shared/globalization";
import { BatchAutocomplete } from "../../../batch/batch-autocomplete";
import { Subscription } from "rxjs";
import { KilosSacksConverterService } from "../../../shared/kilos-sacks-converter/kilos-sacks-converter.service";
import { BatchTransfer } from "./batch-transfer";
import { Batch } from "../../../batch/batch";
import { BatchService } from "../../../batch/batch.service";
import { BatchLogFilter } from 'app/batch-log/batch-log-filter';

@Component({
  selector: 'app-batch-list-ownership-transfer-form',
  templateUrl: 'batch-list-ownership-transfer-form.component.html',
  styleUrls: ['../../../../assets/css/cafe.css']
})
export class BatchListOwnershipTransferFormComponent implements OnInit, OnDestroy {
  closeConfirm = new ModalManager();
  loading: boolean;
  error: boolean;
  form: FormGroup;

  @Input() batchsTransfer: BatchTransfer[];
  @Input() ownerStakeholderId: string;
  @Output() removeBatchTransfer: EventEmitter<string> = new EventEmitter<string>();

  batchTransfer: BatchTransfer;
  batchAutocomplete: BatchAutocomplete;
  batchSubscription: Subscription;
  batchOriginSelected: Batch;
  decimalMask = Masks.decimalMask;
  integerMask = Masks.integerMask;
  idBatchTransferTemp: number;

  constructor(
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandler,
    private kilosSacksConverterService: KilosSacksConverterService,
    private batchService: BatchService,
  ) { }

  ngOnInit() {
    Notification.clearErrors();
    this.batchAutocomplete = new BatchAutocomplete(
      this.batchService,
      this.errorHandler
    );
    this.idBatchTransferTemp = 0;
    this.batchAutocomplete.value = null

    this.buildForm();
  }

  ngOnDestroy() {
    if (this.batchSubscription != null && !this.batchSubscription.closed) {
      this.batchSubscription.unsubscribe();
    }
  }

  kilosToSacks() {
    // quando o calculo é manual, não faz a conversão
    if (this.isCalcManual() == false) {
      let sacks: number = this.kilosSacksConverterService.kilosToSacks(NumberHelper.fromPTBR(this.form.value.quantityTransfer), this.batchOriginSelected);
      this.form.get('quantityBags').setValue(sacks);
    }
    this.form.get('quantityTransfer').setValue(NumberHelper.toPTBR(this.form.value.quantityTransfer));
  }

  sacksToKilos() {
    // quando o calculo é manual, não faz a conversão
    if (this.isCalcManual() == false) {
      let kilos: number = this.kilosSacksConverterService.sacksToKilos(this.form.value.quantityBags, this.batchOriginSelected);
      this.form.get('quantityTransfer').setValue(NumberHelper.toPTBR(kilos));
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      batchOriginCode: [this.batchTransfer && this.batchTransfer.batchOrigin ? this.batchTransfer.batchOrigin.batchCode : '', [Validators.required]],
      batchDestinyCode: [this.batchTransfer ? this.batchTransfer.batchDestinyCode : '', [Validators.required]],
      quantityTransfer: [this.batchTransfer && this.batchTransfer.quantityTransfer && this.batchTransfer.quantityTransfer > 0 ? this.batchTransfer.quantityTransferString : '', [Validators.required]],
      quantityBags: [this.batchTransfer && this.batchTransfer.quantityBags > 0 ? this.batchTransfer.quantityBags : '', [Validators.required]],
      calcManual: [this.batchTransfer && this.batchTransfer.calcManual ? this.batchTransfer.calcManual : false],
      refClient: [(this.batchTransfer && this.batchTransfer.refClient) || ''],
      availableBags: [],
      availableWeight: [],
      certificates: [],
    });
  }

  edit(batchTransfer: BatchTransfer) {
    this.batchTransfer = batchTransfer;
    this.buildForm();
    this.batchAutocomplete.value = batchTransfer.batchOrigin;
  }

  beforeRemove(batchTransfer: BatchTransfer) {
    this.batchTransfer = batchTransfer;
    this.closeConfirm.open(null);
  }

  remove() {

    // remove na lista referenciada, pois por aqui, não remove de lá
    this.removeBatchTransfer.emit(this.batchTransfer.tempId);

    this.fillBatchTransferEmpty();
    this.batchAutocomplete.value = null;
    this.buildForm();

    this.loading = false;
  }

  isCalcManual(): boolean {
    return (this.form.get('calcManual').value) ? true : false;
  }

  save() {
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }
    this.loading = true;
    if (!this.batchTransfer) {
      this.fillBatchTransferEmpty()
    }

    this.batchTransfer.batchOrigin = this.batchAutocomplete.value;
    this.batchTransfer.refClient = this.form.get('refClient').value;
    this.batchTransfer.batchDestinyCode = this.form.get('batchDestinyCode').value;
    this.batchTransfer.quantityTransfer = NumberHelper.fromPTBR(this.form.get('quantityTransfer').value);
    this.batchTransfer.quantityBags = NumberHelper.fromPTBR(this.form.get('quantityBags').value);
    this.batchTransfer.calcManual = this.isCalcManual();

    if (!this.batchTransfer.tempId) {
      //Validar unicidade do lote origem / destino
      let batchTransferAux = this.batchsTransfer.find(f => f.batchOrigin.batchCode == this.batchTransfer.batchOrigin.batchCode);
      if (batchTransferAux) {
        Notification.error('Já existe uma combinação com o Lote Origem informado!');
        this.loading = false;
        return;
      }

      this.idBatchTransferTemp++;
      this.batchTransfer.tempId = this.idBatchTransferTemp + "";
      this.batchsTransfer.push(this.batchTransfer);
      this.loading = false;
      this.fillBatchTransferEmpty();
      this.batchAutocomplete.value = null;
      this.clearForm();
    }
    else {
      //Validar unicidade do lote origem / destino
      let batchTransferAux = this.batchsTransfer.find(f => f.tempId != this.batchTransfer.tempId
        && (f.batchOrigin.batchCode == this.batchTransfer.batchOrigin.batchCode));
      if (batchTransferAux) {
        Notification.error('Já existe uma combinação com o Lote Origem informado!');
        this.loading = false;
        return;
      }

      let newBatchsTransfer = [];

      this.batchsTransfer.forEach(f => {
        newBatchsTransfer.push(f.tempId !== this.batchTransfer.tempId ? f : this.batchTransfer)
      });

      this.batchsTransfer = newBatchsTransfer;
      this.loading = false;
      this.fillBatchTransferEmpty();
      this.batchAutocomplete.value = null;
      this.clearForm();
    }
  }

  clearForm() {
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].setValue(null);
      this.form.controls[key].markAsPristine();
    });
    this.form.get('quantityTransfer').setValue(null);
  }

  handleError(error) {
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  fillBatchTransferEmpty() {
    this.batchTransfer = new BatchTransfer(
      undefined,
      new Batch(),
      '',
      null,
      null,
      false
    );
  }

  get totalQuantityTransfer() {
    let total = this.batchsTransfer.map(b => b.quantityTransfer).reduce((a, b) => a + b, 0);
    return NumberHelper.toPTBR(total);
  }

  get totalQuantityBags() {
    return this.batchsTransfer.map(b => b.quantityBags).reduce((a, b) => a +b, 0);
  }
}
