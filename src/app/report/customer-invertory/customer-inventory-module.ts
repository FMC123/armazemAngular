import {NgModule} from "@angular/core/src/metadata/ng_module";
import {SharedModule} from "../../shared/shared.module";
import { CustomerInventoryRouting } from "./customer-inventory-routing.module";
import { CustomerInventoryComponent } from "./customer-inventory.component";
import { CustomerInventoryService } from "./customer-inventory.service";

@NgModule({
  imports: [
    SharedModule,
    CustomerInventoryRouting
  ],
  declarations: [
    CustomerInventoryComponent
  ],
  exports: [
    CustomerInventoryComponent
  ],
  providers: [
    CustomerInventoryService,
  ]

})
export class CustomerInventoryModule { }
