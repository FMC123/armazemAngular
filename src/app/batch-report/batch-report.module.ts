import { BatchReportOutComponent } from './out/batch-report-out.component';
import { BatchReportStockComponent } from './stock/batch-report-stock.component';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { BatchReportRoutingModule, routedComponents } from './batch-report-routing.module';
import { BatchReportService } from './batch-report.service';
import { BatchReportInComponent } from './in/batch-report-in.component';
import { BatchReportSearchComponent } from './search/batch-report-search.component';
import { BatchReportRemoteComponent } from './remote/batch-report-remote.component';
import { BatchReportExchangeComponent } from './exchange/batch-report-exchange.component';
import { SearchResultComponent } from './search-result/search-result.component';


@NgModule({
  imports: [
    SharedModule,
    BatchReportRoutingModule,
  ],
  exports: [],
  declarations: [
    ...routedComponents,
    BatchReportSearchComponent,
    BatchReportInComponent,
    BatchReportOutComponent,
    BatchReportStockComponent,
    BatchReportRemoteComponent,
    BatchReportExchangeComponent,
    SearchResultComponent
  ],
  providers: [
    BatchReportService,
  ],
})
export class BatchReportModule { }
