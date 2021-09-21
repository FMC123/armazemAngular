import { Notification } from './../../shared/notification/notification';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ErrorHandler } from 'app/shared/errors/error-handler';
import { Masks } from 'app/shared/forms/masks/masks';
import {
  StorageUnitBatchLogFilter,
} from 'app/storage-unit-batch-log/storage-unit-batch-log-list/storage-unit-batch-log-filter';
import { ForkliftService } from 'app/forklift/forklift.service';
import { Forklift } from 'app/forklift/forklift';
import { StorageUnitBatchLogService } from '../storage-unit-batch-log.service';
import { StorageUnitBatchLog } from '../storage-unit-batch-log';
import { Page } from 'app/shared/page/page';
const FileSaver = require('file-saver');

@Component({
  selector: 'app-storage-unit-batch-log-filter',
  templateUrl: 'storage-unit-batch-log-filter.component.html'
})

export class StorageUnitBatchLogFilterComponent implements OnInit {
  @Input() loading: boolean;
  @Output() filterChange = new EventEmitter<StorageUnitBatchLogFilter>();
  @Input() page: Page<StorageUnitBatchLog>;

  form: FormGroup;
  forklifts: Array<Forklift>;

  filter = new StorageUnitBatchLogFilter();
  integerMask = Masks.integerMask;
  dateMask = Masks.dateMask;
  decimalMask = Masks.decimalMask;

  tiposMovimentacao = [
    { code: "E", name: "Entrada" },
    { code: "M", name: "Movimentação interna/remoção" },
    { code: "S", name: "Saída" }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandler,
    private forkliftService: ForkliftService,
    private storageUnitLogService: StorageUnitBatchLogService
  ) { }

  ngOnInit() {
    this.forkliftService.list()
      .then((forklifts) => {
        this.forklifts = forklifts;
      }).then(() => this.buildForm());
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'createdDateStartString': [''],
      'createdDateEndString': [''],
      'type': [''],
      'forkliftId': [''],
      'userName': [''],
      'positionCode': [''],
      'tagCode': [''],
      'batchOperationCode': [''],
      'batchCode': [''],
      'ownerName': [''],
      'quantity': [''],
    });
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.filter = StorageUnitBatchLogFilter.fromData(this.form.value);
    this.filterChange.emit(this.filter);
  }

  submitPdf() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }
    this.gerarPdf();
  }

  submitCsv() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }
    this.gerarCsv();
  }

  gerarPdf() {

    this.loading = true;
    let filtro = StorageUnitBatchLogFilter.fromData(this.form.value);
    let sort: string = (this.page.sortBy) ? this.page.sortBy + ' ' + this.page.sortOrder : null;

    let blob: Promise<Blob> = this.storageUnitLogService.relatorioHistoricoMovimentacao(filtro, sort);
    blob.then((b) => {
      if (b.size === 0) {
        Notification.error('Não foi encontrado informações para abrir o relatório!');
      } else {
        let urlReport = window.URL.createObjectURL(b);
        window.open(urlReport);
      }
      this.loading = false;
    });
  }

  gerarCsv() {

    this.loading = true;
    let filtro = StorageUnitBatchLogFilter.fromData(this.form.value);
    let sort: string = (this.page.sortBy) ? this.page.sortBy + ' ' + this.page.sortOrder : null;

    this.storageUnitLogService.relatorioHistoricoMovimentacaoList(filtro, sort).then((list: Array<StorageUnitBatchLog>) => {

      if (list.length === 0) {
        Notification.error('Não foi encontrado informações para abrir o relatório!');
      }

      let csv = 'MOVIMENTAÇÃO;DURAÇÃO;DATA E HORA;EMPILHADEIRA;LOCALIZAÇÃO;TAG;PESO;LOTE;ROMANEIO;PROPRIETÁRIO;OPERADOR;BAG LIDA;POSIÇÃO LIDA\n';

      list.forEach(values => {
        csv += ((values.storageUnitLog.movementTypeObject != null && values.storageUnitLog.movementTypeObject.name != null)
          ? values.storageUnitLog.movementTypeObject.name
          : '') + ';';
        csv += ((values.storageUnitLog.durationLogDatePickDateMS) ? values.storageUnitLog.durationLogDatePickDateMS : '') + ';';
        csv += values.storageUnitLog.logDateString + ';';
        csv += ((values.forklift && values.forklift.name) ? values.forklift.name : '') + ';';
        csv += values.storageUnitLog.location + ';';
        csv += values.storageUnitLog.tag.tagCode + ';';
        csv += values.quantity + " " + values.unitType + ';';
        csv += values.batch.batchCode + ';';
        csv += values.batch.batchOperation.batchOperationCode + ';';
        csv += values.batch.batchOperation.owner.person.name + ';';
        csv += values.lastModifiedBy.login + ';';
        csv += (values.storageUnitLog.indRfid ? 'Sim' : 'Não') + ';';
        csv += (values.storageUnitLog.indAutoPosition ? 'Sim' : 'Não') + ';';
        csv += '\n';
      });

      FileSaver.saveAs(new Blob([csv], { type: "text/csv;charset=utf-8" }), 'RelatorioHistoricoMovimentacao.csv');
      this.loading = false;
    });
  }
}