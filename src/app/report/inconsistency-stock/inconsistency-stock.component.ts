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
import { DuctClean } from 'app/report/duct-clean/duct-clean';
import { DuctCleanService } from 'app/report/duct-clean/duct-clean.service';
import { CollaboratorAutocomplete } from '../../collaborator/collaborator-autocomplete';
import { CollaboratorService } from '../../collaborator/collaborator.service';
import { InconsistencyService } from './inconsistency-stock.service';
import { InconsistencyStock } from './inconsistency-stock';
const FileSaver = require('file-saver');

@Component({
  selector: 'inconsistency-stock',
  templateUrl: './inconsistency-stock.component.html'

})
export class InconsistencyStockComponent implements OnInit {
  loading: boolean = false;
  form: FormGroup;
  dateMask: any = Masks.dateMask;
  batchCode: string;
  collaboratorId: string;
  collaboratorAutocomplete: CollaboratorAutocomplete;


  constructor(
    private errorHandler: ErrorHandler,
    private logger: Logger,
    private formBuilder: FormBuilder,
    private collaboratorService: CollaboratorService,
    private inconsistencyStock: InconsistencyService,
  ) { }

  ngOnInit() {
    this.collaboratorAutocomplete = new CollaboratorAutocomplete(this.collaboratorService, this.errorHandler);
    this.buildForm();
  }

  submitPdf() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }

    this.loading = true;
    let is = new InconsistencyStock();
    is.batchCode = this.form.value.batchCode;
    is.collaborator = this.collaboratorAutocomplete.value;
    this.inconsistencyStockReportPdf(is);
  }

  submitCsv() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }

    this.loading = true;
    let is = new InconsistencyStock();
    is.batchCode = this.form.value.batchCode;
    is.collaborator = this.collaboratorAutocomplete.value;
    this.inconsistencyStockReportCsv(is);
  }

  buildForm() {
    this.collaboratorId = null;
    this.form = this.formBuilder.group({
      'batchCode': [this.batchCode || ''],
      'collaboratorId': [this.collaboratorId || '']

    });
  }



  inconsistencyStockReportPdf(inconsistency: InconsistencyStock) {
    let blob: Promise<Blob> = this.inconsistencyStock.find(inconsistency);
    blob.then((b) => {
      if (b.size === 0) {
        Notification.error('Não foi encontrado informações para abrir o relatório!');
      } else {
        let urlReport = window.URL.createObjectURL(b);
        window.open(urlReport);
      }
      this.loading = false;
    }).catch((error) => {
      this.errorHandler.fromServer(error);
      this.loading = false;
    });
  }

  inconsistencyStockReportCsv(inconsistency: InconsistencyStock) {
    this.inconsistencyStock.findCsv(inconsistency).then((inconsistencys: Array<InconsistencyStock>) => {
      let csv = 'MATRICULA: ' + ';' + 'CLIENTE: ' + ';' + 'LOTE:' + ';' + 'PESO:' + ';' + 'QUANTIDADE SACAS:' + ';' + 'MEDIA SACAS: \n';
      inconsistencys.forEach(values => {
        let personName = values.personName;
        let registration = values.registration;

        values.listInconsistency.forEach(stock => {
          csv = csv + registration + ';' + personName + ';' + stock.batchCode + ';' + stock.quantitySacks + ';' + stock.sacks + ';' + stock.averageWeightSack + '\n';
        })
      });
      FileSaver.saveAs(new Blob([csv], { type: "text/csv;charset=utf-8" }), 'RelatorioInconsistenciaDeEstoque.csv');
      this.loading = false;
    }).catch((error) => {
      this.errorHandler.fromServer(error);
      this.loading = false;
    });
  }
}
