import { BalanceTransportationInService } from './balance-transportation/balance-transportation-in.service';
import { TransportationSharedModule } from '../transportation/transportation-shared.module';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    SharedModule,
    TransportationSharedModule,
  ],
  exports: [],
  declarations: [],
  providers: [
    BalanceTransportationInService,
  ],
})
export class BalanceSharedModule { }
