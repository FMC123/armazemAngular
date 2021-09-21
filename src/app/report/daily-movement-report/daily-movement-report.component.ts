import { Component, OnInit } from '@angular/core';
import { Search } from '../../shared/search/search';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Notification } from '../../shared/notification/notification';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WarehouseStakeholderAutocomplete } from 'app/warehouse-stakeholder/warehouse-stakeholder-autocomplete';
import { Subscription } from 'rxjs';
import { WarehouseStakeholderService } from 'app/warehouse-stakeholder/warehouse-stakeholder.service';
import { Masks } from 'app/shared/forms/masks/masks';
import { DailyMovementReportFilter } from './daily-movement-report-filter';
import { BatchService } from 'app/batch/batch.service';

@Component({
  selector: 'app-daily-movement-report',
  templateUrl: './daily-movement-report.component.html'
})
export class DailyMovementReportComponent implements OnInit {
  loading: boolean;
  search: Search = new Search();
  filter: DailyMovementReportFilter;
  form: FormGroup;
  integerMask = Masks.integerMask;
  dateMask = Masks.dateMask;
  decimalMask = Masks.decimalMask;

  ownerAutocomplete: WarehouseStakeholderAutocomplete;
  ownerSubscription: Subscription;

  constructor(private service: BatchService,
    private formBuilder: FormBuilder,
    private warehouseStakeholderService: WarehouseStakeholderService,
    private errorHandler: ErrorHandler) { }

  ngOnInit() {
    Notification.clear();
    this.ownerAutocomplete = new WarehouseStakeholderAutocomplete(this.warehouseStakeholderService, this.errorHandler);
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'dateStartString': ['', [Validators.required]],
      'dateEndString': ['', [Validators.required]],
      'stakeholderId': ['', [Validators.required]],
    });

    this.ownerAutocomplete.value = '';
    this.ownerSubscription = this.ownerAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('stakeholderId').setValue(id);
    });
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.filter = DailyMovementReportFilter.fromData(this.form.value);
    this.gerarRelatorio();
  }

  /**
   * Gera relatório em PDF
   */
  gerarRelatorio() {

    this.loading = true;

    let blob: Promise<Blob> = this.service.dailyMovementReport(this.filter);

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

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}