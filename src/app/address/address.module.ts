import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { AddressRoutingModule } from './address-routing.module';
import { AddressService } from './address.service';

@NgModule({
  imports: [
   SharedModule,
   AddressRoutingModule,


  ],
  declarations: [
  ],

  providers: [
    AddressService,
  ]
})
export class AddressModule { }
