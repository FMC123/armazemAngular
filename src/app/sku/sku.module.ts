import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {SkuFormComponent} from './sku-form/sku-form.component';
import {SkuListComponent} from './sku-list/sku-list.component';
import {SkuRoutingModule} from './sku-routing.module';
import {SkuService} from './sku.service';
import {SkuDetailsComponent} from "./sku-list-details/sku-list-details.component";
import {SkuCreatorComponent} from "./sku-creator/sku-creator.component";
import {SkuEditComponent} from "./sku-edit/sku-edit.component";

@NgModule({
  imports: [
    SharedModule,
    SkuRoutingModule
  ],
  declarations: [
    SkuFormComponent,
    SkuListComponent,
    SkuDetailsComponent,
    SkuCreatorComponent,
    SkuEditComponent
  ],
  providers: [
    SkuService,
  ]
})
export class SkuModule {
}
