import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';
import { Component } from '@angular/core/src/metadata/directives';
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormGroup } from '@angular/forms/src/model';
import { Masks } from 'app/shared/forms/masks/masks';
import { FormBuilder } from '@angular/forms/src/form_builder';
import { CustomValidators } from 'app/shared/forms/validators/custom-validators';
import { PackTypeService } from 'app/pack-type/pack-type.service';
import { PackType } from 'app/pack-type/pack-type';
import { DailyEntryService } from 'app/report/daily-entry/daily-entry.service';
import { DailyEntry } from 'app/report/daily-entry/daily-entry';
import { DateTimeHelper } from 'app/shared/globalization/date-time-helper';
import { Validators } from '@angular/forms/src/validators';
import { DailyEntryBatchOperation } from './daily-entry-batch-operation';
import { GenericType } from '../../pack-type/generic-type';
const FileSaver = require('file-saver');

@Component({
  selector: 'daily-entry',
  templateUrl: './daily-entry.component.html'

})
export class DailyEntryComponent implements OnInit {
  loading: boolean = false;
  form: FormGroup;
  dateMask: any = Masks.dateMask;
  packTypes: Array<PackType>;
  packTypeStorageId: string;
  packTypeTransportId: string;


  constructor(
    private errorHandler: ErrorHandler,
    private logger: Logger,
    private formBuilder: FormBuilder,
    private packTypeService: PackTypeService,
    private dailyEntryService: DailyEntryService
  ) { }

  ngOnInit() {
    this.buildForm();

    this.packTypeService.list().then(packTypes => {
      this.packTypes = packTypes;
    });
  }

  submitPdf() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }
    this.dailyEntryReportPdf();
  }

  submitCsv() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }
    this.dailyEntryReportCsv();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'packTypeStorage': [this.packTypeStorageId || ''],
      'packTypeTransport': [this.packTypeTransportId || ''],
      'createdDateStartString': [
        '',
        [Validators.required],
      ],
      'createdDateEndString': [
        '',
        [Validators.required],
      ]
    });
  }

  dailyEntryReportPdf() {
    this.loading = true;
    let dailyEntry = new DailyEntry();
    let dateStart = this.form.value.createdDateStartString;
    let dateEnd = this.form.value.createdDateEndString;

    dateStart = DateTimeHelper.fromDDMMYYYYHHmm(dateStart);
    dateEnd = DateTimeHelper.fromDDMMYYYY(dateEnd, true);

    dailyEntry.from = +new Date(dateStart ? dateStart : 0);
    dailyEntry.to = +new Date(dateEnd ? dateEnd : 0);
    dailyEntry.packTypeStorage = this.form.value.packTypeStorage;
    dailyEntry.packTypeTransport = this.form.value.packTypeTransport;
    let blob: Promise<Blob> = this.dailyEntryService.find(dailyEntry);
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

  dailyEntryReportCsv() {
    this.loading = true;
    let dailyEntry = new DailyEntry();
    let dateStart = this.form.value.createdDateStartString;
    let dateEnd = this.form.value.createdDateEndString;

    dateStart = DateTimeHelper.fromDDMMYYYYHHmm(dateStart);
    dateEnd = DateTimeHelper.fromDDMMYYYY(dateEnd, true);

    dailyEntry.from = +new Date(dateStart ? dateStart : 0);
    dailyEntry.to = +new Date(dateEnd ? dateEnd : 0);
    dailyEntry.packTypeStorage = this.form.value.packTypeStorage;
    dailyEntry.packTypeTransport = this.form.value.packTypeTransport;
    this.dailyEntryService.findCsv(dailyEntry).then((dailyEntryPackType: Array<DailyEntryBatchOperation>) => {
      if (dailyEntryPackType.length === 0) {
        Notification.error('Não foi encontrado informações para abrir o relatório!');
      }
      let csv = 'DATA ENTRADA: ' + ';' + 'ROMANEIO: ' + ';' + 'CLIENTE:' + ';' + 'SACAS:' + ';' + 'LOTES:' + ';' + 'EMB. ARMAZENAMENTO:' + ';' + 'EMB. TRANSPORTE: \n';
      dailyEntryPackType.forEach(values => {
        let createdDate = values.createdDate;
        let batchOperationCode = values.batchOperationCode;
        let quantitySacks = values.quantitySacks;
        let nameCollaborator = values.nameCollaborator;

        values.listDailyEntry.forEach(daily => {
          csv += createdDate + ';';
          csv += batchOperationCode + ';';
          csv += nameCollaborator + ';';
          csv += quantitySacks + ';';
          csv += daily.batchCode + ';';
          csv += (daily.codeStorageType ? daily.codeStorageType : '') + ';';
          csv += (daily.codePackType ? daily.codePackType : '') + '\n';
        })
      });

      FileSaver.saveAs(new Blob([csv], { type: "text/csv;charset=utf-8" }), 'RelatorioEntradaDiaria.csv');
      this.loading = false;
    });
  }
}
