import { NgModule } from '@angular/core';

import { AddressSharedModule } from '../address/address-shared.module';
import { SharedModule } from './../shared/shared.module';
import { FarmFormComponent } from './farm-form/farm-form.component';
import { FarmDetailsComponent } from './farm-list-details/farm-list-details.component';
import { FarmListInfoComponent } from './farm-list-details/farm-list-info.component';
import { FarmRoutingModule } from './farm-routing.module';
import { FarmService } from './farm.service';

@NgModule({
  imports: [
    SharedModule,
    FarmRoutingModule,
    AddressSharedModule,

  ],
  declarations: [
    FarmFormComponent,
    FarmListInfoComponent,
    FarmDetailsComponent

  ],

  providers: [
    FarmService,
  ]
})
export class FarmModule { }
