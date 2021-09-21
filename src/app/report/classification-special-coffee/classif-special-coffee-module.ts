import { NgModule } from "@angular/core/src/metadata/ng_module";
import { SharedModule } from "app/shared/shared.module";
import {ClassifSpecialCoffeeRouting} from "./classif-special-coffee-routing.module";
import {ClassifSpecialCoffeeService} from "./classif-special-coffee.service";
import {ClassifSpecialCoffeeComponent} from "./classif-special-coffee.component";


@NgModule({
  imports: [
    SharedModule,
    ClassifSpecialCoffeeRouting
  ],
  declarations: [
    ClassifSpecialCoffeeComponent
  ],
  exports: [
    ClassifSpecialCoffeeComponent
  ],
  providers: [
    ClassifSpecialCoffeeService
  ]

})
export class ClassifSpecialCoffeeModule { }
