import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { CustomerContactRoutingModule } from './customer-contact-routing.module';
import { CustomerContactService } from './customer-contact.service';

@NgModule({
  imports: [
    SharedModule,
    CustomerContactRoutingModule,
  ],
  declarations: [
  ],
  providers: [
    CustomerContactService,
  ]
})

export class CustomerContactModule { }
