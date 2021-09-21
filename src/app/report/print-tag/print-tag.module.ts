import { NgModule } from "@angular/core/src/metadata/ng_module";
import { SharedModule } from "app/shared/shared.module";
import { SaleSummaryRoutingModule } from "app/report/sale-summary/sale-summary-routing.module";
import { SaleSummaryComponent } from "app/report/sale-summary/sale-summary.component";
import { SaleSummaryService } from "app/report/sale-summary/sale-summary.service";
import { PrintTagRoutingModule } from "./print-tag-rounting.module";
import { PrintTagComponent } from "./print-tag.component";
import { PrintTagService } from "./print-tag.service";
import { TagService } from "../../tag/tag.service";




@NgModule({
  imports: [
    SharedModule,
    PrintTagRoutingModule
  ],
  declarations: [
    PrintTagComponent
  ],
  exports: [
    PrintTagComponent
  ],
  providers: [
    PrintTagService,
    TagService
  ]

})
export class PrintTagModule { }
