import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {PowerBiComponent} from "./power-bi.component";
import {PowerBiService} from "./power-bi.service";
import {PowerBIModule} from "angular2-powerbi";

@NgModule({
  imports: [SharedModule, PowerBIModule],
  exports: [PowerBiComponent],
  declarations: [PowerBiComponent],
  providers: [PowerBiService]
})
export class PowerBiModule {
}
