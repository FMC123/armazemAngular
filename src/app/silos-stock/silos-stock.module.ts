import {SilosStockListComponent} from "./silos-stock-list/silos-stock-list.component";
import {SilosStockRoutingModule} from "./silos-stock-routing.module";
import {SharedModule} from "../shared/shared.module";
import {NgModule} from "@angular/core";
import {PositionService} from "../position/position.service";

@NgModule({
  imports: [
    SharedModule,
    SilosStockRoutingModule
  ],
  declarations: [
    SilosStockListComponent,
  ],
  providers: [
    PositionService
  ]
})

export class SilosStockModule {

}
