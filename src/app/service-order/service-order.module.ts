import {NgModule} from '@angular/core';

import {SharedModule} from './../shared/shared.module';
import {ServiceOrderService} from "./service-order.service";

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [],

  providers: [
    ServiceOrderService
  ]
})
export class ServiceOrderModule {
}
