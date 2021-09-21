import { ConfirmInlineComponent } from './forms/confirm-inline/confirm-inline.component';
import { TruncatePipe } from './truncate/truncate.pipe';
import { InfoTableComponent } from './info-table/info-table.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TextMaskModule } from 'angular2-text-mask';

import { Search } from './search/search';
import { PageModule } from './page/page.module';
import { LoadingComponent } from './loading/loading.component';
import { ErrorHandler } from './errors/error-handler';
import { Logger } from './logger/logger';
import { NoResultsComponent } from './no-results/no-results.component';
import { SubmitButtonComponent } from './forms/submit-button/submit-button.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ModalDirective } from './modals/modal.directive';
import { ConfirmComponent } from './modals/confirm.component';
import { AlertComponent } from './modals/alert.component';
import { ReceiptComponent } from './modals/receipt.component';
import { ModalManager } from './modals/modal-manager';
import { TooltipDirective } from './tooltip/tooltip.directive';
import { ErrorMessageComponent } from './forms/errors/error-message.component';
import { ErrorGroupDirective } from './forms/errors/error-group.directive';
import { DateTimePickerDirective } from './forms/datetimepicker/datetimepicker.directive';
import { DatePickerDirective } from './forms/datetimepicker/datepicker.directive';
import { AutocompleteComponent } from './forms/autocomplete/autocomplete.component';
import { Focusable } from './forms/focusable/focusable.directive';
import { ExcludeComponent } from './forms/exclude/exclude.component';
import { TypeaheadModule } from 'ngx-bootstrap';
import { KilosToSacksComponent } from './kilos-sacks-converter/kilos-to-sacks.component';
import { KilosSacksConverterService } from './kilos-sacks-converter/kilos-sacks-converter.service';
import { ReportFieldsInfoModalComponent } from './report-fields-info/report-fields-info-modal.component';
import { ReportFieldsInfoService } from './report-fields-info/report-fields-info.service';
import { WarehouseStakeholderFormModalComponent } from 'app/warehouse-stakeholder/warehouse-stakeholder-modal/warehouse-stakeholder-form-modal.component';
import { RouterHelperService} from './router-helper/router-helper.service';
import {DriverIncidentFormModalComponent} from "../incident/driver-incident-modal/driver-incident-form-modal.component";
import {TextInputComponent} from "./modals/text-input-modal.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TextMaskModule,
    TypeaheadModule.forRoot(),
  ],
  providers: [
    ErrorHandler,
    Logger,
    KilosSacksConverterService,
    ReportFieldsInfoService,
    RouterHelperService
  ],
  declarations: [
    LoadingComponent,
    NoResultsComponent,
    SubmitButtonComponent,
    BreadcrumbComponent,
    ModalDirective,
    TooltipDirective,
    ConfirmComponent,
    AlertComponent,
    TextInputComponent,
    ErrorMessageComponent,
    ErrorGroupDirective,
    DateTimePickerDirective,
    DatePickerDirective,
    AutocompleteComponent,
    InfoTableComponent,
    Focusable,
    TruncatePipe,
    ExcludeComponent,
    ConfirmInlineComponent,
    KilosToSacksComponent,
    ReportFieldsInfoModalComponent,
    WarehouseStakeholderFormModalComponent,
    DriverIncidentFormModalComponent,
    ReceiptComponent
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    TextMaskModule,
    LoadingComponent,
    NoResultsComponent,
    SubmitButtonComponent,
    BreadcrumbComponent,
    ModalDirective,
    ConfirmComponent,
    AlertComponent,
    TextInputComponent,
    TooltipDirective,
    ErrorMessageComponent,
    ErrorGroupDirective,
    DateTimePickerDirective,
    DatePickerDirective,
    PageModule,
    AutocompleteComponent,
    InfoTableComponent,
    Focusable,
    TruncatePipe,
    ExcludeComponent,
    TypeaheadModule,
    ConfirmInlineComponent,
    KilosToSacksComponent,
    ReportFieldsInfoModalComponent,
    WarehouseStakeholderFormModalComponent,
    DriverIncidentFormModalComponent,
    ReceiptComponent
  ]
})
export class SharedModule { }
export { ErrorHandler };
export { ModalManager };
export { Search };
