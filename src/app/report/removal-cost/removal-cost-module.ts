import {NgModule} from "@angular/core/src/metadata/ng_module";
import {SharedModule} from "../../shared/shared.module";
import {RemovalCostRouting} from "./removal-cost-routing.module";
import {RemovalCostComponent} from "./removal-cost.component";
import {RemovalCost} from "./removal-cost";
import {RemovalCostService} from "./removal-cost.service";
import {MarkupGroupService} from "../../markup-group/markup-group.service";

@NgModule({
  imports: [
    SharedModule,
    RemovalCostRouting
  ],
  declarations: [
    RemovalCostComponent
  ],
  exports: [
    RemovalCostComponent
  ],
  providers: [
    RemovalCostService,
    MarkupGroupService
  ]

})
export class RemovalCostModule { }
