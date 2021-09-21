import { Component, OnInit, OnDestroy } from '@angular/core';
import { Search } from '../../shared/search/search';
import { Logger } from '../../shared/logger/logger';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Notification } from '../../shared/notification/notification';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WarehouseStakeholderAutocomplete } from 'app/warehouse-stakeholder/warehouse-stakeholder-autocomplete';
import { Subscription } from 'rxjs';
import { WarehouseStakeholderService } from 'app/warehouse-stakeholder/warehouse-stakeholder.service';
import { Masks } from 'app/shared/forms/masks/masks';
import { ServiceInstructionService } from 'app/service-instruction/service-instruction.service';
import { ServiceInstructionReportFilter } from '../service-instruction-report/service-instruction-report-filter';


@Component({
  selector: 'app-forecast-eviction-report',
  templateUrl: './forecast-eviction-report.component.html'
})
export class ForecastEvictionReportComponent implements OnInit {
  loading: boolean;
  search: Search = new Search();
  filter: ServiceInstructionReportFilter;
  form: FormGroup;
  integerMask = Masks.integerMask;
  dateMask = Masks.dateMask;
  decimalMask = Masks.decimalMask;

  ownerAutocomplete: WarehouseStakeholderAutocomplete;
  ownerSubscription: Subscription;

  constructor(private service: ServiceInstructionService,
    private formBuilder: FormBuilder,
    private warehouseStakeholderService: WarehouseStakeholderService,
    private errorHandler: ErrorHandler,
    private logger: Logger) { }

  ngOnInit() {
    Notification.clearErrors();
    this.ownerAutocomplete = new WarehouseStakeholderAutocomplete(this.warehouseStakeholderService, this.errorHandler);
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'createdDateStartString': ['', [Validators.required]],
      'stakeholderId': ['', [Validators.required]],
      'type': ['', [Validators.required]],
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

    this.filter = new ServiceInstructionReportFilter(this.form.get('createdDateStartString').value,
      null, this.form.get('stakeholderId').value);
    this.gerarRelatorio();
  }

  /**
   * Gera relatório
   */
  gerarRelatorio() {
    // tipo de relatótio
    // resumo/sintético
    this.loading = true;

    let blob: Promise<Blob> = (this.form.get('type').value == '1')
      ? this.service.forecastEvictionSyntheticReport(this.filter)
      : this.service.forecastEvictionAnalyticalReport(this.filter);

    blob.then((b) => {
      if (b.size === 0) {
        this.handleError({message: "Não foi encontrado informações para abrir o relatório!"});
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
