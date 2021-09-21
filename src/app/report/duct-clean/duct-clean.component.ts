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

@Component({
  selector: 'duct-clean',
  templateUrl: './duct-clean.component.html'

})


export class DuctCleanComponent implements OnInit {
  loading: boolean = false;
  form: FormGroup;
  dateMask: any = Masks.dateMask;
  batchCode: string;


  constructor(
    private errorHandler: ErrorHandler,
    private logger: Logger,
    private formBuilder: FormBuilder,
    private packTypeService: PackTypeService,
    private ductCleanService: DuctCleanService
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }
    this.ductCleanReport();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'batchCode': [this.batchCode || ''],
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

  ductCleanReport() {
    this.loading = true;
    let ductClean = new DuctClean();
    let dateStart = this.form.value.createdDateStartString;
    let dateEnd = this.form.value.createdDateEndString;

    dateStart = DateTimeHelper.fromDDMMYYYYHHmm(dateStart);
    dateEnd = DateTimeHelper.fromDDMMYYYY(dateEnd, true);

    ductClean.from = +new Date(dateStart ? dateStart : 0);
    ductClean.to =  +new Date(dateEnd ? dateEnd : 0);
    ductClean.batchCode = this.form.value.batchCode;

    let blob: Promise<Blob> = this.ductCleanService.find(ductClean);
    blob.then((b) => {
      if (b.size === 0) {
        Notification.error('Não foi encontrado informações para abrir o relatório!');
      }else {
        let urlReport = window.URL.createObjectURL(b);
        window.open(urlReport);
      }
      this.loading = false;
    });
  }
}
