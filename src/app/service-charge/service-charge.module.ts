import { NgModule } from '@angular/core';

import { LogModule } from '../log/log.module';
import { SharedModule } from './../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    LogModule,
  ],
  declarations: [
  ],
})
export class ServiceChargeModule { }
