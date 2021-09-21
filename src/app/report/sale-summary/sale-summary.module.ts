import { NgModule } from "@angular/core/src/metadata/ng_module";
import { SharedModule } from "app/shared/shared.module";
import { SaleSummaryRoutingModule } from "app/report/sale-summary/sale-summary-routing.module";
import { SaleSummaryComponent } from "app/report/sale-summary/sale-summary.component";
import { SaleSummaryService } from "app/report/sale-summary/sale-summary.service";




@NgModule({
  imports: [
    SharedModule,
    SaleSummaryRoutingModule
  ],
  declarations: [
    SaleSummaryComponent
  ],
  exports: [
    SaleSummaryComponent
  ],
  providers: [
    SaleSummaryService
  ]

})
export class SaleSummaryModule { }
