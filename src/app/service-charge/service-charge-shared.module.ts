import { ServiceChargeService } from './service-charge.service';
import { ServiceChargeComponent } from './service-charge-form/service-charge-form.component';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';



@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    ServiceChargeComponent,
  ],
  declarations: [
    ServiceChargeComponent,
  ],
  providers: [ServiceChargeService],
})
export class ServiceChargeSharedModule { }
