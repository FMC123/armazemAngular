import { NgModule } from "@angular/core/src/metadata/ng_module";
import { SharedModule } from "app/shared/shared.module";
import { InconsistencyStockRoutingModule } from "./inconsistency-stock-routing.module";
import { InconsistencyStockComponent } from "./inconsistency-stock.component";
import { InconsistencyService } from "./inconsistency-stock.service";


@NgModule({
  imports: [
    SharedModule,
    InconsistencyStockRoutingModule
  ],
  declarations: [
    InconsistencyStockComponent
  ],
  exports: [
    InconsistencyStockComponent
  ],
  providers: [
    InconsistencyService
  ]

})
export class InconsistencyModule { }
