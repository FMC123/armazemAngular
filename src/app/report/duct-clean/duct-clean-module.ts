import { NgModule } from "@angular/core/src/metadata/ng_module";
import { SharedModule } from "app/shared/shared.module";
import { DuctCleanRouting } from "app/report/duct-clean/duct-clean-rounting.module";
import { DuctCleanComponent } from "app/report/duct-clean/duct-clean.component";
import { DuctCleanService } from "app/report/duct-clean/duct-clean.service";



@NgModule({
  imports: [
    SharedModule,
    DuctCleanRouting
  ],
  declarations: [
    DuctCleanComponent
  ],
  exports: [
    DuctCleanComponent
  ],
  providers: [
    DuctCleanService
  ]

})
export class DuctCleanModule { }
