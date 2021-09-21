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
import { SaleSummaryService } from 'app/report/sale-summary/sale-summary.service';
import { PrintTagService } from './print-tag.service';
import { CertificateService } from '../../certificate/certificate.service';
import { Certificate } from '../../certificate/certificate';
import { PrintTag } from './print-tag';
import { TagService } from '../../tag/tag.service';
import { Tag } from '../../tag/tag';

@Component({
  selector: 'print-tag',
  templateUrl: './print-tag.component.html'

})
export class
  PrintTagComponent implements OnInit {
  loading: boolean = false;
  form: FormGroup;
  error: boolean;
  tagCode: number;
  quantity: number;
  certifateId: string;
  page: Page<Certificate> = new Page<Certificate>();
  search: Search = new Search();
  enableButton: boolean;

  constructor(
    private errorHandler: ErrorHandler,
    private logger: Logger,
    private formBuilder: FormBuilder,
    private printTagService: PrintTagService,
    private certificateService: CertificateService,
    private tagService: TagService,
  ) {
  }

  ngOnInit() {
    this.enableButton = true;
    this.loadingTag();
    this.buildForm();

    this.loadList();

    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });
    this.search
      .subscribe(() => {
        this.loadList();
      });
  }

  loadingTag() {
    this.tagService.findNextTagOfWarehouse().then(tag => {
      this.tagCode = tag.tagCode;
      this.buildForm();
      this.enableButton = true;
    });
  }

  loadList() {
    this.error = false;
    this.loading = true;
    this.certificateService.listPaged(this.search.value, this.page).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  submit() {
    this.enableButton = false;
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }
    this.printTagReport();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'tagCode': [this.tagCode || '', Validators.required],
      'quantity': [this.quantity || 1, CustomValidators.maxValidator(20)],
      'certifateId': [this.certifateId || ''],
    });
  }

  printTagReport() {
    if (this.quantity > 20) {
      Notification.error("Número máximo de impressão excedido. Escolha um número menor que ou igual a 20");
      return;
    }
    this.loading = true;
    let printTag = new PrintTag();
    printTag.certificateId = this.form.value.certifateId;
    printTag.quantity = this.form.value.quantity;
    printTag.tagStarted = this.form.value.tagCode;

    let blob: Promise<Blob> = this.printTagService.find(printTag);
    blob.then((b) => {
      if (b.size === 0) {
        Notification.error('Não foi encontrado informações para abrir o relatório!');
      } else {
        let urlReport = window.URL.createObjectURL(b);
        window.open(urlReport);
      }
      this.loading = false;
      this.loadingTag();
    });
  }

  handleError(error) {
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
